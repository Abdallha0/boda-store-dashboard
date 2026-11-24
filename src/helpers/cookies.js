const TOKEN_KEY = "token";
// 7 days expiry — adjust as needed
const EXPIRES_DAYS = 7;

function buildCookieString(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  return `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

export function setTokenCookie(token) {
  document.cookie = buildCookieString(TOKEN_KEY, token, EXPIRES_DAYS);
}

export function getTokenCookie() {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(TOKEN_KEY + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function removeTokenCookie() {
  // Setting expires in the past removes the cookie
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}
