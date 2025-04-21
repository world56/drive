import './grpc-service.js';
import fastify from "fastify";
import routes from "./routes.js";

const app = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

try {
  routes(app);
  await app.listen({ port: 2003 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
