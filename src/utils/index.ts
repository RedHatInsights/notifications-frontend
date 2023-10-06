export const toUtc = (date: Date) => new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
export const fromUtc = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
