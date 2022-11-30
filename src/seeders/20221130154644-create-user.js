module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'Yoghi Oktapiansyah',
      username: 'okta',
      password: '$2b$10$suzTQvJWNF2LEDLaBE1QcuWUBZLm0vxp.ROsb3X4mZquC5dT1eNf6', //okta
      user: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};