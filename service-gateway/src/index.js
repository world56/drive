const proxy = require("./proxy");
const fastify = require("fastify");
const redis = require("@fastify/redis");

const app = fastify({
  // logger: {
  //   transport: {
  //     target: "@fastify/one-line-logger",
  //   },
  // },
});

const start = async () => {
  try {
    proxy(app);
    app.register(redis, { url: "redis://:slash@127.0.0.1:6379" });
    await app.listen({ port: 2000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
