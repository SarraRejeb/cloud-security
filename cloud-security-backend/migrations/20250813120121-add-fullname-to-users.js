'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'fullname', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '' // Valeur par défaut pour éviter les erreurs sur les anciens enregistrements
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'fullname');
  }
};
