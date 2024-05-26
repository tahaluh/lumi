import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RouteDefinition } from '../types/RouteDefinition';

/**
 * Provides services common to all API methods
 */
export default abstract class BaseController {
	public abstract routes(): RouteDefinition[];
	public abstract basePath: string;

	/**
	 * Global method to send API response
	 * @param res
	 * @param statusCode
	 */
	public send(res: Response, statusCode: number = StatusCodes.OK, data?: any): void {
		if (data) {
			res.status(statusCode).json(data);
		} else {
			res.sendStatus(statusCode);
		}
	}

}
