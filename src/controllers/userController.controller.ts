const utils = require("@utils/index");

async function personalInfo(req, res) {
  const user = await utils.getUser(req);
  return res.json(user);
}

async function getUserLibrary(req, res) {
  const user = await utils.getUser(req);
  const books = user.library;

  return res.status(200).send({
    message: "run",
  });
}

module.exports = {
  personalInfo,
  getUserLibrary,
};

export {};
