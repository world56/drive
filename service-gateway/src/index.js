const proxy = require("./proxy");
const fastify = require("fastify");
const cors = require("@fastify/cors");
const redis = require("@fastify/redis");
const cookie = require('@fastify/cookie');

const app = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

const start = async () => {
  try {
    proxy(app);
    app.register(cors);
    app.register(cookie);
    app.register(redis, { url: "redis://:slash@127.0.0.1:6379" });
    await app.listen({ port: 2000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
