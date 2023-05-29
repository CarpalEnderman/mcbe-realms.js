const realms = require("./index");
require("dotenv").config();
const { MS_EMAIL, MS_PASSWORD } = process.env;

realms
  .login(MS_EMAIL, MS_PASSWORD)
  .then((user) => user.getRealms())
  .then(console.log);
