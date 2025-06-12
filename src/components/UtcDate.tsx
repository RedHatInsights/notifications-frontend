export function getDateDaysAgo(days: number): string {
  const today = new Date();
  const xDaysAgo = new Date(today.setDate(today.getDate() - days));
  return xDaysAgo.toISOString().split('.')[0];
}
