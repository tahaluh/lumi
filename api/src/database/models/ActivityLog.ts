import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface ActivityLogAttributes {
	id: string;
	userId: string;
	activityType: string;
	details: string;
	createdAt?: Date;
}

interface ActivityLogCreationAttributes extends Optional<ActivityLogAttributes, 'id'> { }

class ActivityLog extends Model<ActivityLogAttributes, ActivityLogCreationAttributes> implements ActivityLogAttributes {
	public id!: string;
	public userId!: string;
	public activityType!: string;
	public details!: string;
	public readonly createdAt!: Date;
}

ActivityLog.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		activityType: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		details: {
			type: DataTypes.STRING(400),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'ActivityLog',
		tableName: 'ActivityLogs',
		timestamps: true,
	},
);

export { ActivityLog, ActivityLogAttributes, ActivityLogCreationAttributes };
