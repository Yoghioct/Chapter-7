const bcrypt = require("bcrypt");

module.exports = {
  encrypt: (password) => {
    return bcrypt.hashSync(password, 10);
  },
  comparePassword: (password, encryptedPassword) => {
    return bcrypt.compareSync(password, encryptedPassword);
  }
};
