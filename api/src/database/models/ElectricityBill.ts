import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface ElectricityBillAttributes {
	uuid: string;
	clientNumber: string | null;
	intallationNumber: string | null;
	referenceMonth: string | null;
	dueDate: string | null;
	energyAmount: number | null;
	energyPrice: number | null;
	energyTotal: number | null;
	energyICMSAmount: number | null;
	energyICMSPrice: number | null;
	energyICMSTotal: number | null;
	energyCompensatedAmount: number | null;
	energyCompensatedPrice: number | null;
	energyCompensatedTotal: number | null;
	publicLightingContribution: number | null;
	totalPrice: number | null;
	barCode: string | null;
	pdfUrl: string | null;
	pdfText: string | null;
}

interface ElectricityBillCreationAttributes extends Optional<ElectricityBillAttributes, 'uuid'> { }

class ElectricityBill extends Model<ElectricityBillAttributes, ElectricityBillCreationAttributes> implements ElectricityBillAttributes {
	public uuid!: string;
	public clientNumber!: string | null;
	public intallationNumber!: string | null;
	public referenceMonth!: string | null;
	public dueDate!: string | null;
	public energyAmount!: number | null;
	public energyPrice!: number | null;
	public energyTotal!: number | null;
	public energyICMSAmount!: number | null;
	public energyICMSPrice!: number | null;
	public energyICMSTotal!: number | null;
	public energyCompensatedAmount!: number | null;
	public energyCompensatedPrice!: number | null;
	public energyCompensatedTotal!: number | null;
	public publicLightingContribution!: number | null;
	public totalPrice!: number | null;
	public barCode!: string | null;
	public pdfUrl!: string | null;
	public pdfText!: string | null;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

ElectricityBill.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		clientNumber: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		intallationNumber: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		referenceMonth: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		dueDate: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyAmount: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyPrice: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyTotal: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyICMSAmount: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyICMSPrice: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyICMSTotal: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyCompensatedAmount: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyCompensatedPrice: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		energyCompensatedTotal: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		publicLightingContribution: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		totalPrice: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		barCode: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		pdfUrl: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		pdfText: {
			type: DataTypes.TEXT,
			allowNull: true,
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

