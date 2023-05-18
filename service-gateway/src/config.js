const BASE_URL = "/api";

const config = [
  {
    prefix: `${BASE_URL}/auth`,
    upstream: "http://127.0.0.1:2001",
    auth: false,
    rateLimit: {},
    whitelist: [`${BASE_URL}/auth/crypto`, `${BASE_URL}/auth/account/*`],
  },
];

module.exports = config;
