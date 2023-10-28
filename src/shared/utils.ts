export const createLookup = <T extends string>(arr: readonly T[]) =>
  arr.reduce(
    (acc, item) => ({ ...acc, [item]: item }),
    {} as { [key in T]: Extract<T, key> },
  );

export const groupBy = (key: string) => (array: any[]) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
