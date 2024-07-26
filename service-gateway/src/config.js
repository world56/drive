const BASE_URL = "/api";

const config = [
  {
    prefix: `${BASE_URL}/auth`,
    upstream: "http://127.0.0.1:2001",
    auth: true,
    rateLimit: {},
    whitelist: [`${BASE_URL}/auth/crypto`, `${BASE_URL}/auth/account/*`],
  },
  {
    prefix: `${BASE_URL}/explorer`,
    upstream: "http://127.0.0.1:2002",
    auth: true,
    rateLimit: {},
    whitelist: [],
  },
  {
    prefix: `${BASE_URL}/favorite`,
    upstream: "http://127.0.0.1:2002",
    auth: true,
    rateLimit: {},
    whitelist: [],
  },
  {
    prefix: `${BASE_URL}/recovery`,
    upstream: "http://127.0.0.1:2002",
    auth: true,
    rateLimit: {},
    whitelist: [],
  },
];

module.exports = config;
