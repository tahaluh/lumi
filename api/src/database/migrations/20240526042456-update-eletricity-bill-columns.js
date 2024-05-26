'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ElectricityBills', 'month');
    await queryInterface.removeColumn('ElectricityBills', 'consumedElectricity');
    await queryInterface.removeColumn('ElectricityBills', 'totalAmount');
    await queryInterface.removeColumn('ElectricityBills', 'energyCompensated');
    await queryInterface.removeColumn('ElectricityBills', 'details');
    await queryInterface.addColumn('ElectricityBills', 'installationNumber', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'referenceMonth', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'dueDate', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyAmount', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyPrice', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyTotal', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyICMSAmount', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyICMSPrice', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyICMSTotal', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyCompensatedAmount', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyCompensatedPrice', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyCompensatedTotal', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'publicLightingContribution', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'totalPrice', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'barCode', {
      type: Sequelize.STRING(64),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'pdfUrl', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('ElectricityBills', 'pdfText', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('ElectricityBills', 'month', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.addColumn('ElectricityBills', 'consumedElectricity', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.addColumn('ElectricityBills', 'totalAmount', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.addColumn('ElectricityBills', 'energyCompensated', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.addColumn('ElectricityBills', 'details', {
      type: Sequelize.STRING(400),
      allowNull: false,
    });
    await queryInterface.removeColumn('ElectricityBills', 'installationNumber');
    await queryInterface.removeColumn('ElectricityBills', 'referenceMonth');
    await queryInterface.removeColumn('ElectricityBills', 'dueDate');
    await queryInterface.removeColumn('ElectricityBills', 'energyAmount');
    await queryInterface.removeColumn('ElectricityBills', 'energyPrice');
    await queryInterface.removeColumn('ElectricityBills', 'energyTotal');
    await queryInterface.removeColumn('ElectricityBills', 'energyICMSAmount');
    await queryInterface.removeColumn('ElectricityBills', 'energyICMSPrice');
    await queryInterface.removeColumn('ElectricityBills', 'energyICMSTotal');
    await queryInterface.removeColumn('ElectricityBills', 'energyCompensatedAmount');
    await queryInterface.removeColumn('ElectricityBills', 'energyCompensatedPrice');
    await queryInterface.removeColumn('ElectricityBills', 'energyCompensatedTotal');
    await queryInterface.removeColumn('ElectricityBills', 'publicLightingContribution');
    await queryInterface.removeColumn('ElectricityBills', 'totalPrice');
    await queryInterface.removeColumn('ElectricityBills', 'barCode');
    await queryInterface.removeColumn('ElectricityBills', 'pdfUrl');
    await queryInterface.removeColumn('ElectricityBills', 'pdfText');
  }
};