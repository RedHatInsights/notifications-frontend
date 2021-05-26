// Array utilities

export const intersect = <T>(arr1: ReadonlyArray<T>, arr2: ReadonlyArray<T>): Array<T> => arr1.filter(e => arr2.includes(e));
export const diff = <T>(arr: ReadonlyArray<T>, minus: ReadonlyArray<T>): Array<T> => arr.filter(e => !minus.includes(e));
