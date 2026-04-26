export const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // fallback для старых браузеров
  return Date.now().toString() + Math.random().toString(16).slice(2);
};