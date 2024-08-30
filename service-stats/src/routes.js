import dayjs from "dayjs";
import redis from "./redis.js";
import { getStorage } from "./utils.js";
import { getCount } from "./grpc-client.js";

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
}
