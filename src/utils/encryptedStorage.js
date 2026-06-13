const SECRET = 'CC-ENCRYPT-2026';

const xorEncode = (value) => {
  const text = String(value ?? '');
  let output = '';
  for (let i = 0; i < text.length; i += 1) {
    const keyChar = SECRET.charCodeAt(i % SECRET.length);
    output += String.fromCharCode(text.charCodeAt(i) ^ keyChar);
  }
  return output;
};

export const encryptValue = (value) => {
  const encoded = xorEncode(value);
  return btoa(unescape(encodeURIComponent(encoded)));
};

export const decryptValue = (value) => {
  if (!value) return '';
  try {
    const decoded = decodeURIComponent(escape(atob(value)));
    return xorEncode(decoded);
  } catch (error) {
    console.warn('Unable to decrypt stored value.', error);
    return '';
  }
};

export const saveEncryptedItem = (key, value) => {
  if (typeof window === 'undefined') return;
  const encrypted = encryptValue(value ?? '');
  localStorage.setItem(key, encrypted);
};

export const readEncryptedItem = (key, fallback = '') => {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  return raw ? decryptValue(raw) : fallback;
};

export const saveEncryptedJson = (key, value) => {
  saveEncryptedItem(key, JSON.stringify(value ?? []));
};

export const readEncryptedJson = (key, fallback = []) => {
  const raw = readEncryptedItem(key, '');
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn('Unable to parse encrypted JSON value.', error);
    return fallback;
  }
};
