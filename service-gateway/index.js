const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("@fastify/middie"));

const start = async () => {
  try {
    await fastify.listen({ port: 2000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();