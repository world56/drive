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
      const code = reply.statusCode;
      const IS_SUCCESS = code === 200;
      switch (type) {
        case "application/json":
          return reply.code(200).send(toJSON(chunks, code));
        case "text/plain":
          const context = Buffer.concat(chunks).toString();
          reply
            .code(200)
            .type("application/json; charset=utf-8")
            .send(
              IS_SUCCESS
                ? { code: 200, content: context, message: "success" }
                : { code: code, content: null, message: context },
            );
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
