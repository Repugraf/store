export const copyValue = <T>(value: T): T => (
  typeof value === "object" && value !== null
    ? JSON.parse(JSON.stringify(value))
    : value
);

export const getUniqueId = () => (
  Math.random().toString(36).substr(2) + Date.now().toString(36)
);
