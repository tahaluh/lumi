import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface UserAttributes {
	uuid: string;
	name: string;
	email: string;
	password: string;
	userType: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'uuid'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public uuid!: string;
	public name!: string;
	public email!: string;
	public password!: string;
	public userType!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		userType: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'Users',
		timestamps: true,
	},
);

export { User, UserAttributes, UserCreationAttributes };
