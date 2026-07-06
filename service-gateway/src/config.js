const BASE_URL = "/api";

const config = [
  {
    prefix: `${BASE_URL}/auth`,
    upstream: "http://127.0.0.1:2001",
    auth: true,
    rateLimit: {},
    whitelist: [
      `${BASE_URL}/auth/crypto`,
      `${BASE_URL}/auth/account/login`,
      `${BASE_URL}/auth/account/super`,
      `${BASE_URL}/auth/account/logout`,
      `${BASE_URL}/auth/account/register`,
    ],
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
  {
    prefix: `${BASE_URL}/stats`,
    upstream: "http://127.0.0.1:2003",
    auth: true,
    rateLimit: {},
    whitelist: [],
  },
  {
    prefix: `${BASE_URL}/storage`,
    upstream: "http://127.0.0.1:2004",
    auth: true,
    rateLimit: {},
    whitelist: [],
  },
];

module.exports = config;
