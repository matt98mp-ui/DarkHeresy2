// Centralized DOM helpers (cached by id) to avoid duplicate lookups + redeclare bugs.
const _idCache = new Map();

/** Cached getElementById */
export function el(id) {
  if (_idCache.has(id)) return _idCache.get(id);
  const node = document.getElementById(id);
  _idCache.set(id, node);
  return node;
}

/** querySelector */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/** querySelectorAll (returns NodeList) */
export function qsa(selector, root = document) {
  return root.querySelectorAll(selector);
}

/** Clear caches (useful in tests or hard rerenders) */
export function clearDomCache() {
  _idCache.clear();
}
