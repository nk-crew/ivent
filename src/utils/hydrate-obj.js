export default function hydrateObj(obj, meta = {}) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        },
      });
    }
  }

  return obj;
}
