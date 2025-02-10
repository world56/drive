import dayjs from "dayjs";
import redis from "./redis.js";
import { loadGrpcPackage } from "./utils.js";
import { Server, ServerCredentials } from "@grpc/grpc-js";

const RPC_STATS = loadGrpcPackage("../../proto/stats.proto");

const server = new Server();

server.addService(RPC_STATS.stats.StatsService.service, {
  access: async (call, callback) => {
    const key = `drive:use:${dayjs().format("MM-DD")}`;
    const { id } = call.request;
    const exists = await redis.exists(key);
    await redis.sadd(key, id);
    if (!exists) {
      const now = dayjs().unix();
      const end = dayjs().add(14, "day").startOf("day").unix();
      await redis.expire(key, end - now);
    }
    callback();
  },
  count: async (call, callback) => {
    const { type, count } = call.request;
    const num = await redis.hget(`drive:storage`, type);
    const result = Number(num || 0) + count;
    await redis.hset(`drive:storage`, type, Math.max(0, result));
    callback();
  },
});

server.bindAsync(
  "0.0.0.0:9003",
  ServerCredentials.createInsecure(),
  (err, _port) => {
    if (err != null) {
      console.error(err);
    }
  },
);
