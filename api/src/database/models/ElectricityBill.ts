import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface ElectricityBillAttributes {
	id: string;
	clientNumber: string;
	month: string;
	consumedElectricity: number;
	totalAmount: number;
	energyCompensated: number;
	details: string;
}

interface ElectricityBillCreationAttributes extends Optional<ElectricityBillAttributes, 'id'> { }

class ElectricityBill extends Model<ElectricityBillAttributes, ElectricityBillCreationAttributes> implements ElectricityBillAttributes {
	public id!: string;
	public clientNumber!: string;
	public month!: string;
	public consumedElectricity!: number;
	public totalAmount!: number;
	public energyCompensated!: number;
	public details!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

ElectricityBill.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		clientNumber: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		month: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		consumedElectricity: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		totalAmount: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		energyCompensated: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		details: {
			type: DataTypes.STRING(400),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'ElectricityBill',
		tableName: 'ElectricityBills',
		timestamps: true,
	},
);

export { ElectricityBill, ElectricityBillAttributes, ElectricityBillCreationAttributes };
