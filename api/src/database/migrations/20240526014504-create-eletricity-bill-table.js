'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ElectricityBills', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      clientNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      month: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      consumedElectricity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      energyCompensated: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      details: {
        type: Sequelize.STRING(400),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ElectricityBills');
  }
};