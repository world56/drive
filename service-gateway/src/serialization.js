const CONTENT_TYPE_WHITE_LIST = ["application/json", "text/plain"];

function toJSON(chunks = [], code = 200) {
  const content = { code, message: "success" };
  const data = JSON.parse(Buffer.concat(chunks));
  if (code === 200) {
    content.content = data;
  } else {
    content.content = null;
    content.message = data;
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
          const code = reply.statusCode;
          return reply.code(200).send(toJSON(chunks, code));
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
