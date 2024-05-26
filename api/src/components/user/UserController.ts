import { Request, Response, NextFunction } from 'express';
import { UserService } from './UserService';
import BaseController from '../BaseController';
import { RouteDefinition } from '../../types/RouteDefinition';

const userService = new UserService();

export default class UserController extends BaseController {
	private userService: UserService;

	public basePath: string = '/users';

	constructor() {
		super();
	}

	public routes(): RouteDefinition[] {
		return [
			{ path: '/', method: 'get', handler: this.getAllUsers.bind(this) },
			{ path: '/:id', method: 'get', handler: this.getUserById.bind(this) },
		];
	}

	async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const users = await this.userService.getAllUsers();
			this.send(res, 200, users);
		} catch (error) {
			next(error);
		}
	}

	async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.params.id;
			const user = await this.userService.getUserById(userId);
			if (!user) {
				res.sendStatus(404);
				return;
			}
			this.send(res, 200, user);
		} catch (error) {
			next(error);
		}
	}
}
