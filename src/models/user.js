'use strict';
const {
  Model
} = require('sequelize');
const { encrypt, comparePassword } = require('../utils/common');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static register({ name, username, password }) {
      return this.create({ name, username, password: encrypt(password) });
    }

    static async authenticate({ username, password }) {
      const user = await this.findOne({ where: { username } });
      if (!user) throw new Error("User not found");

      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) throw new Error("User not found");

      return user;
    }
  }
  User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};