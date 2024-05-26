import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface ElectricityBillAttributes {
	uuid: string;
	clientNumber: string | null;
	installationNumber: string | null;
	referenceMonth: string | null;
	dueDate: string | null;
	energyAmount: string | null;
	energyPrice: string | null;
	energyTotal: string | null;
	energyICMSAmount: string | null;
	energyICMSPrice: string | null;
	energyICMSTotal: string | null;
	energyCompensatedAmount: string | null;
	energyCompensatedPrice: string | null;
	energyCompensatedTotal: string | null;
	publicLightingContribution: string | null;
	totalPrice: string | null;
	barCode: string | null;
	pdfUrl: string | null;
	pdfText: string | null;
}

interface ElectricityBillCreationAttributes extends Optional<ElectricityBillAttributes, 'uuid'> { }

class ElectricityBill extends Model<ElectricityBillAttributes, ElectricityBillCreationAttributes> implements ElectricityBillAttributes {
	public uuid!: string;
	public clientNumber!: string | null;
	public installationNumber!: string | null;
	public referenceMonth!: string | null;
	public dueDate!: string | null;
	public energyAmount!: string | null;
	public energyPrice!: string | null;
	public energyTotal!: string | null;
	public energyICMSAmount!: string | null;
	public energyICMSPrice!: string | null;
	public energyICMSTotal!: string | null;
	public energyCompensatedAmount!: string | null;
	public energyCompensatedPrice!: string | null;
	public energyCompensatedTotal!: string | null;
	public publicLightingContribution!: string | null;
	public totalPrice!: string | null;
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
		installationNumber: {
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
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyPrice: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyTotal: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyICMSAmount: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyICMSPrice: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyICMSTotal: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyCompensatedAmount: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyCompensatedPrice: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		energyCompensatedTotal: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		publicLightingContribution: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		totalPrice: {
			type: DataTypes.STRING(50),
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
			type: DataTypes.JSON,
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

