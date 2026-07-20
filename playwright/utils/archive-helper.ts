import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const SAMPLE_ARCHIVE = resolve(__dirname, '../data/sample_archive.tar.gz');

const MACHINE_ID_FILES = [
  'etc/machine-id',
  'etc/insights-client/machine-id',
  'etc/redhat-access-insights/machine-id',
];

/**
 * Create a rewritten copy of the sample insights archive with a unique
 * hostname and fresh machine IDs. Each upload registers as a new system
 * in host-inventory, triggering a "new system registered" notification.
 *
 * Returns the path to the new tar.gz (caller must clean up).
 */
export function createUniqueArchive(): {
  archivePath: string;
  hostname: string;
  cleanup: () => void;
} {
  const workDir = mkdtempSync(join(tmpdir(), 'pw-archive-'));
  const random = Math.random().toString(36).substring(2, 8);
  const hostname = `pw-${random}-notif-test`;

  execSync(`tar xzf ${SAMPLE_ARCHIVE}`, { cwd: workDir });

  const entries = readdirSync(workDir);
  const originalDir = entries[0];
  const newDir = `insights-${hostname}-${Date.now()}`;

  execSync(`mv "${originalDir}" "${newDir}"`, { cwd: workDir });

  const newUUID = randomUUID();
  const hexId = newUUID.replace(/-/g, '');

  for (const relPath of MACHINE_ID_FILES) {
    const fullPath = join(workDir, newDir, relPath);
    const content = relPath === 'etc/machine-id' ? hexId : newUUID;
    writeFileSync(fullPath, content + '\n');
  }

  const archivePath = join(workDir, 'rewritten_archive.tar.gz');
  execSync(`tar czf rewritten_archive.tar.gz "${newDir}"`, { cwd: workDir });

  const cleanup = () => {
    try {
      rmSync(workDir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  };

  return { archivePath, hostname, cleanup };
}
