export const copyValue = <T>(value: T): T => (
  typeof value === "object" && value !== null
    ? JSON.parse(JSON.stringify(value))
    : value
);
