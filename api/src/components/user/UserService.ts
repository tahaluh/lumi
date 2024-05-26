import { User, UserAttributes, UserCreationAttributes } from '../../database/models/User';
import logger from '../../lib/logger';

export class UserService {
	async getAllUsers(): Promise<UserAttributes[]> {
		try {
			const users = await User.findAll();
			return users;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getUserById(id: string | number): Promise<UserAttributes> {
		try {
			const user = await User.findByPk(id);
			if (!user) {
				throw new Error('User not found');
			}
			return user;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
