const FORBIDDEN = { code: 403, message: "用户未登陆" };
const UNAUTHORIZED = { code: 401, message: "用户登陆超时" };

module.exports = async function (app, request, reply) {
  try {
    const { Authorization } = request.cookies;
    if (Authorization) {
      const user = await app.redis.hgetall(`drive:user:${Authorization}`);
      if (user.id) {
        request.headers["user-id"] = user.id;
        request.headers["user-role"] = user.role;
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
