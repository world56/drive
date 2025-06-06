const CONTENT_TYPE_WHITE_LIST = ["application/json", "text/plain"];

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
  const ContentType = reply.getHeader("content-type") || "";
  const [type] = ContentType.split("; ");
  if (CONTENT_TYPE_WHITE_LIST.includes(type)) {
    const chunks = [];
    res.on("data", (chunk) => chunks.push(chunk));
    res.on("end", () => {
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
  } else {
    reply.send(res);
  }
};
