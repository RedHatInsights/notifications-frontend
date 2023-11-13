// Array utilities

export const intersect = <T>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<T>
): Array<T> => arr1.filter((e) => arr2.includes(e));
export const diff = <T>(
  arr: ReadonlyArray<T>,
  minus: ReadonlyArray<T>
): Array<T> => arr.filter((e) => !minus.includes(e));

export const areEqual = <T>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<T>,
  noOrder?: boolean
): boolean => {
  if (!arr1 || !arr2) {
    return false;
  } else if (arr1 === arr2) {
    return true;
  } else if (arr1.length === arr2.length) {
    return arr1.every((e, idx) => {
      if (
        (noOrder && arr2.includes(e)) ||
        (!noOrder && arr1[idx] === arr2[idx])
      ) {
        return true;
      }

      return false;
    });
  } else {
    return false;
  }
};
