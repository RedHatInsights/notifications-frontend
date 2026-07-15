import { readFileSync } from 'fs';
import { type BrowserContext } from 'playwright';
import { createUniqueArchive } from './archive-helper';

const POLL_INTERVAL_MS = 5_000;
const POLL_TIMEOUT_MS = 60_000;
const INGRESS_API = '/api/ingress/v1/upload';

function getDrawerApiUrl(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const startDate = d.toISOString().split('.')[0];
  return `/api/notifications/v1.0/notifications/drawer?startDate=${startDate}&limit=50`;
}

/**
 * Ensure the test user has at least one drawer notification.
 * If none exist, uploads a rewritten insights archive to the ingress
 * API and polls until a notification appears (up to 60s).
 *
 * Uses the authenticated browser page to make API calls, since the
 * platform auth tokens (managed by chrome JS) aren't available via
 * cookie-only APIRequestContext.
 *
 * Does not throw on failure — the test assertions will catch it.
 */
export async function seedNotificationsIfNeeded(context: BrowserContext): Promise<void> {
  const page = await context.newPage();

  try {
    // Navigate to the app and wait for chrome's auth to initialize
    await page.goto('/', { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => typeof (window as any).insights?.chrome?.auth?.getToken === 'function',
      { timeout: 30000 }
    );

    // Check if notifications already exist
    const existing = await page.evaluate(async (url) => {
      const res = await fetch(url);
      if (!res.ok) return 0;
      const body = await res.json();
      const data = body?.data ?? body;
      return Array.isArray(data) ? data.length : 0;
    }, getDrawerApiUrl());

    if (existing > 0) {
      console.log(`✅ Drawer already has ${existing} notification(s), skipping seed`);
      return;
    }

    console.log('📭 No drawer notifications found, seeding via ingress upload...');

    const { archivePath, hostname, cleanup } = createUniqueArchive();

    try {
      const archiveBuffer = readFileSync(archivePath);
      const base64Archive = archiveBuffer.toString('base64');

      const uploadStatus = await page.evaluate(
        async ({ api, data }) => {
          const binary = atob(data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], {
            type: 'application/vnd.redhat.advisor.payload+tgz',
          });

          const form = new FormData();
          form.append('file', blob, 'archive.tar.gz');

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const token = await (window as any).insights?.chrome?.auth?.getToken?.();
          const headers: Record<string, string> = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const res = await fetch(api, { method: 'POST', body: form, headers });
          return { ok: res.ok, status: res.status, statusText: res.statusText };
        },
        { api: INGRESS_API, data: base64Archive }
      );

      if (!uploadStatus.ok) {
        console.error(
          `❌ Ingress upload failed: ${uploadStatus.status} ${uploadStatus.statusText}`
        );
        return;
      }

      console.log(`📤 Archive uploaded (hostname: ${hostname}), polling for notification...`);

      const deadline = Date.now() + POLL_TIMEOUT_MS;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        const count = await page.evaluate(async (url) => {
          const res = await fetch(url);
          if (!res.ok) return 0;
          const body = await res.json();
          const data = body?.data ?? body;
          return Array.isArray(data) ? data.length : 0;
        }, getDrawerApiUrl());

        if (count > 0) {
          console.log(`✅ Notification appeared (${count} total)`);
          return;
        }
      }

      console.warn('⚠️ Notification did not appear within 60s — tests may fail');
    } finally {
      cleanup();
    }
  } finally {
    await page.close();
  }
}
