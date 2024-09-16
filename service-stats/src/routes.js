import {
  getCount,
  getFavoriteRanking,
  getExplorerRecently,
} from "./grpc-client.js";
import dayjs from "dayjs";
import redis from "./redis.js";
import { getStorage } from "./utils.js";
import { TIME_ONE_HOUR } from "./config.js";

export default async function routes(app) {
  app.route({
    method: "GET",
    url: "/storage",
    async handler() {
      const { total, free } = await getStorage();
      const used = total - free;
      const exists = await redis.exists(`drive:storage`);
      if (!exists) {
        const data = await getCount();
        await redis.hset(`drive:storage`, data);
      }
      const storage = await redis.hgetall(`drive:storage`);
      return { free, total, used, storage };
    },
  });

  app.route({
    method: "GET",
    url: "/access",
    handler() {
      return Promise.all(
        Array.from({ length: 14 }, async (_, i) => {
          const date = dayjs().subtract(i, "day").format("MM-DD");
          const value = await redis.scard(`drive:use:${date}`);
          return { date, value };
        }),
      );
    },
  });

  app.route({
    method: "PUT",
    url: "/hot",
    schema: {
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
          },
        },
      },
    },
    async handler(req) {
      await redis.zincrby(`drive:hot`, 1, req.body.name);
      return true;
    },
  });

  app.route({
    method: "GET",
    url: "/hot",
    async handler() {
      const res = await redis.zrevrange("drive:hot", 0, 9, "WITHSCORES");
      const length = res.length;
      const format = [];
      for (let i = 0; i < length; i += 2) {
        format.push({ name: res[i], value: Number(res[i + 1]) });
      }
      return format;
    },
  });

  app.route({
    method: "GET",
    url: "/recently",
    async handler() {
      const data = await redis.get(`drive:recently`);
      if (data) {
        return JSON.parse(data);
      } else {
        const data = await getExplorerRecently();
        data?.length &&
          redis.set(
            `drive:recently`,
            JSON.stringify(data),
            "EX",
            TIME_ONE_HOUR,
          );
        return data;
      }
    },
  });

  app.route({
    method: "GET",
    url: "/favorite",
    async handler() {
      const data = await redis.get(`drive:favorite`);
      if (data) {
        return JSON.parse(data);
      } else {
        const data = await getFavoriteRanking();
        data?.length &&
          redis.set(
            `drive:favorite`,
            JSON.stringify(data),
            "EX",
            TIME_ONE_HOUR,
          );
        return data;
      }
    },
  });
}
