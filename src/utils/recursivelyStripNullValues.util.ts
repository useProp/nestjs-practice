export const recursivelyStripNullValuesUtil = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return recursivelyStripNullValuesUtil(value);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        recursivelyStripNullValuesUtil(value),
      ]),
    );
  }

  if (value !== null) {
    return value;
  }
};
