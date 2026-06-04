const FORBIDDEN = { code: 403, message: "User not logged in" };
const UNAUTHORIZED = { code: 401, message: "User login timeout" };

module.exports = async function (app, request, reply) {
  try {
    const { Authorization } = request.cookies;
    if (Authorization) {
      const { UserID } = await request.jwtVerify();
      const user = await app.redis.hgetall(`drive:user:${UserID}`);
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
