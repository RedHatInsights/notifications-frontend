import axios from 'axios';

const DAILY_DIGEST_TRIGGER_URL = '/api/notifications/v1.0/org-config/daily-digest/trigger';

export async function triggerDailyDigest(): Promise<void> {
  await axios.post(DAILY_DIGEST_TRIGGER_URL);
}
