export const localUrl = (path: string, isBeta: boolean): string => {
  if (isBeta) {
    return `/preview${path}`;
  }

  return path;
};
