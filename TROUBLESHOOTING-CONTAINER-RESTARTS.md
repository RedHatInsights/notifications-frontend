# Troubleshooting: Container Restarts in E2E Pipeline

**Date**: 2026-07-09  
**Branch**: `debug-restarting-containers`  
**Issue**: Unexpected container restarts after E2E tests in Konflux pipeline

## Problem Statement

The E2E pipeline was experiencing unexpected restarts of the `sidecar-run-application` and `sidecar-frontend-dev-proxy` containers. After restart, the filesystem mounts were reset, causing `caddy: command not found` errors.

## Initial Observations

From OpenShift events:
```
Container sidecar-run-application definition changed, will be restarted
Pulling image "pipelines-nop-rhel9"
Container sidecar-frontend-dev-proxy definition changed, will be restarted
```

This is **Tekton's normal sidecar shutdown process** - when the main test container finishes, Tekton replaces sidecars with "nop" (no-operation) containers.

## Log Analysis

### First Execution (SUCCESSFUL)
```
SIDECAR-RUN-APPLICATION
+ trap 'echo "Received termination signal, stopping Caddy..."; exit 0' SIGTERM SIGINT
+ CADDY_PID=7
+ wait 7
+ caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
{"level":"info","ts":1783618382.8487184,"logger":"http.log","msg":"server running","name":"srv0","protocols":["h1","h2","h3"]}
{"level":"info","ts":1783618387.068079,"logger":"http.log.access","msg":"NOP","request":{"remote_ip":"127.0.0.1"...}}
```

**Key findings**:
- Caddy started successfully on port 8000
- Health check from `frontend-dev-proxy` succeeded (wget request at 1783618387.068079)
- **The trap signal handler NEVER fired** - we never saw "Received termination signal, stopping Caddy..."

### Second Execution (FAILED)
```
+ trap 'echo "Received termination signal, stopping Caddy..."; exit 0' SIGTERM SIGINT
+ CADDY_PID=7
+ wait 7
+ caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
/bin/sh: line 8: caddy: command not found
```

**Key findings**:
- Script ran again from the beginning (full restart, not signal handling)
- Workspace volume was already unmounted
- Caddy binary missing from expected path

### Frontend Dev Proxy Behavior
```
SIDECAR-FRONTEND-DEV-PROXY
Waiting for run-application to be ready on port 8000...
Waiting for run-application... (0/120 seconds)
...
Waiting for run-application... (118/120 seconds)
WARNING: run-application did not become ready after 120 seconds
```

The proxy waited the full 120 seconds but port 8000 never became available on the first startup.

## Root Cause Analysis

### Why Did the Container Restart?

The script had:
```bash
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
CADDY_PID=$!
wait $CADDY_PID
```

**If Caddy exits for ANY reason, `wait` completes and the script exits**, causing the container to restart.

Possible reasons for Caddy exiting:
1. ❌ Resource limits (OOMKilled, CPU throttle) - not seen in logs
2. ❌ Configuration issue - Caddy started successfully
3. ❌ Crash - no error logs present
4. ❓ **Unknown exit reason** - needs more logging to determine

### Why "caddy: command not found" on Restart?

Container inspection confirms:
```bash
$ podman run --rm quay.io/.../notifications-frontend:on-pr-... ls -la /usr/bin/caddy
-rwxrwxr-x. 1 1001 root 77394768 Jul  9 10:17 /usr/bin/caddy
```

Caddy exists at `/usr/bin/caddy` and `/usr/bin` is in PATH. The "command not found" error occurs because:
- On restart, the workspace volume gets unmounted/reset
- The container's filesystem state changes during Tekton's sidecar replacement process

## Solutions Implemented

### Attempt 1: Signal Handling (Commit: 0f43e52)
```bash
trap 'echo "Received termination signal, stopping Caddy..."; exit 0' SIGTERM SIGINT

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
CADDY_PID=$!
wait $CADDY_PID
```

**Result**: Did not prevent restarts. Trap never fired, indicating the container didn't receive SIGTERM before restart.

### Attempt 2: Full Path to Caddy (Commit: dd82332)
```bash
/usr/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
```

**Result**: Didn't solve the restart issue. The problem wasn't PATH resolution but rather that Caddy was exiting.

### Attempt 3: Enhanced Logging + Keep Alive (Commit: b4d443f → e31aa1c)
```bash
#!/bin/bash
set -e

printf "Starting run-application container...\n"
printf "Caddy binary location: %s\n" "$(which caddy || printf '/usr/bin/caddy')"

trap 'printf "[%s] Received termination signal, stopping Caddy...\n" "$(date)"; kill $CADDY_PID 2>/dev/null || true; exit 0' SIGTERM SIGINT SIGHUP

printf "[%s] Starting Caddy on port 8000...\n" "$(date)"
/usr/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
CADDY_PID=$!

printf "[%s] Caddy started with PID %s\n" "$(date)" "$CADDY_PID"
printf "[%s] Waiting for Caddy process or termination signal...\n" "$(date)"

if wait $CADDY_PID; then
  printf "[%s] Caddy exited successfully (exit code 0)\n" "$(date)"
else
  EXIT_CODE=$?
  printf "[%s] Caddy exited with code %s\n" "$(date)" "$EXIT_CODE"
fi

# Keep container alive even if Caddy exits to avoid restart loop
printf "[%s] Caddy process ended, keeping container alive to avoid restart...\n" "$(date)"
while true; do sleep 3600; done
```

**Key improvements**:
- Uses `printf` instead of `echo` (user preference, avoids diagnostic output issues)
- Adds timestamps to all log messages for debugging timeline
- Traps SIGHUP in addition to SIGTERM/SIGINT
- Captures and logs Caddy exit code
- **Critical**: Uses `while true; do sleep 3600; done` to keep container alive even if Caddy exits
  - Prevents restart loop
  - Allows Tekton to terminate the sidecar cleanly when tests finish
  - More portable than `sleep infinity` (which doesn't work on macOS/BSD)

## Architecture Notes

### Container Roles

1. **`run-application` container** (controlled by `run-app-script`):
   - Runs Caddy to serve pre-built static assets
   - Listens on port 8000
   - Assets are baked into the container image via Dockerfile in build-tools/ submodule

2. **`frontend-development-proxy` container** (managed by pipeline):
   - Runs Caddy as a reverse proxy
   - Listens on port 1337 (HTTPS)
   - Routes configured from ConfigMap:
     - `/apps/notifications*` → `127.0.0.1:8000` (run-application)
     - `/settings/notifications*` → `127.0.0.1:8000` (run-application)
     - `/settings/integrations/splunk-setup*` → `127.0.0.1:8000` (run-application)
     - All other routes → Remote HCC staging environment
   - Health checks run-application on port 8000 before starting

### Why Both Use Caddy

- **run-application**: Serves static assets (the built React app)
- **frontend-dev-proxy**: Proxies requests to either the local app OR remote services
- This allows E2E tests to run against local code with remote API/auth services

## Outstanding Questions

1. **Why did Caddy exit after serving the health check request?**
   - No error in logs
   - No obvious resource issues
   - Needs enhanced logging to diagnose

2. **Did the E2E test failure trigger the restart?**
   - E2E test failed with: `❌ Global setup failed: locator.waitFor: Timeout 60000ms exceeded`
   - Timing unclear - did Caddy exit before or after test failure?

3. **Is the frontend-dev-proxy timing out causing run-application to exit?**
   - Proxy waited 120s for port 8000
   - If port 8000 never responded, could that trigger something?

## Testing Plan

Next pipeline run should show:
1. Detailed timestamped logs from run-application container
2. Whether Caddy starts successfully
3. If/when Caddy exits and why (exit code)
4. Whether the container stays alive after Caddy exits
5. Whether the trap fires when tests complete

## Related Files

- `.tekton/notifications-frontend-pull-request.yaml` - Pipeline configuration
- `k8s-resources/notifications-frontend-dev-proxy-caddyfile.yaml` - Proxy routes ConfigMap
- `k8s-resources/notifications-frontend-credentials-secret.yaml` - E2E credentials
- `PIPELINE-SETUP-SUMMARY.md` - Original E2E pipeline setup documentation
- `validate-pipeline-setup.sh` - Validation script

## References

- Konflux E2E Pipeline: `~/repos/konflux/konflux-pipelines/pipelines/platform-ui/docker-build-run-all-tests.yaml`
- Tekton Sidecar Docs: https://tekton.dev/docs/pipelines/tasks/#sidecars
- Frontend Dev Proxy Image: `quay.io/redhat-user-workloads/hcc-platex-services-tenant/frontend-development-proxy:latest`
