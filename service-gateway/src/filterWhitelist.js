// true 不需要验证
module.exports = function (req, whitelist) {
  if (whitelist && whitelist.length) {
    const url = req.raw.url;
    const length = whitelist.length;
    for (let i = 0; i < length; i++) {
      const pattern = whitelist[i];
      const regex = new RegExp(`^${pattern.replace("*", ".*")}$`);
      if (regex.test(url)) {
        return true;
      }
    }
    return false;
  }
  return false;
};
