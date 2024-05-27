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
        allowNull: true,
      },
      installationNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      referenceMonth: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      referenceYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      dueDate: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      energyAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyTotal: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyICMSAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyICMSPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyICMSTotal: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyCompensatedAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyCompensatedPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      energyCompensatedTotal: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      publicLightingContribution: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      barCode: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      pdfUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pdfText: {
        type: Sequelize.JSON,
        allowNull: true,
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