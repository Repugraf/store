export const isPrimitive = (value: any) => (
  typeof value !== "object" || value === null
);

export const copyValue = <T>(value: T): T => (
  isPrimitive(value) ? value : JSON.parse(JSON.stringify(value))
);

export const getUniqueId = () => (
  Math.random().toString(36).substr(2) + Date.now().toString(36)
);

export const isEqual = (firstVal: any, secondVal: any) => {
  try {
    return isPrimitive(firstVal)
      ? firstVal === secondVal
      : JSON.stringify(firstVal) === JSON.stringify(secondVal);
  } catch (e) {
    return false;
  }
};
