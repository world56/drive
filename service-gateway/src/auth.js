const FORBIDDEN = { code: 403, message: "用户未登陆" };
const UNAUTHORIZED = { code: 401, message: "用户登陆超时" };

module.exports = async function (app, request, reply) {
  try {
    const { authorization } = request.headers;
    if (authorization) {
      const id = await app.redis.hget(`drive:user:${authorization}`, "id");
      if (id) {
        request.headers["user-id"] = id;
        return true;
      }
      return reply.send(UNAUTHORIZED);
    } else {
      return reply.send(FORBIDDEN);
    }
  } catch (e) {
    return reply.send({ code: 502, message: String(e) });
  }
};
