const auth = require("./auth");
const config = require("./config");
const proxy = require("@fastify/http-proxy");
const onResponse = require("./serialization");
const filterWhitelist = require("./filterWhitelist");

module.exports = function (app) {
  config.forEach((v) => {
    app.register(proxy, {
      prefix: v.prefix,
      upstream: v.upstream,
      async preHandler(req, reply) {
        req.headers["authorization"] = req.cookies.Authorization;
        if (v.auth && !filterWhitelist(req, v.whitelist)) {
          return await auth(app, req, reply);
        } else {
          return true;
        }
      },
      replyOptions: {
        onResponse,
      },
    });
  });
};
