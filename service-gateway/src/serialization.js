function toJSON(chunks = []) {
  const content = { code: 200, message: "success" };
  const res = JSON.parse(Buffer.concat(chunks));
  if (res && res.statusCode) {
    content.code = res.statusCode;
    content.message = res.message;
  } else {
    content.content = res;
  }
  return content;
}

module.exports = function (request, reply, res) {
  const chunks = [];
  res.on("data", (chunk) => chunks.push(chunk));
  res.on("end", () => {
    const [type] = reply.getHeader("content-type").split("; ");
    switch (type) {
      case "application/json":
        return reply.code(200).send(toJSON(chunks));
      case "text/plain":
        reply
          .code(200)
          .type("application/json; charset=utf-8")
          .send({
            code: 200,
            content: Buffer.concat(chunks).toString(),
            message: "success",
          });
        break;
      default:
        reply.send(res);
        break;
    }
  });
};
