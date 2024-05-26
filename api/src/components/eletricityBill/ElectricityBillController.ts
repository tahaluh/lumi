import { Request, Response, NextFunction } from 'express';
import BaseController from '../BaseController';
import { RouteDefinition } from '../../types/RouteDefinition';
import { ElectricityBillService } from './ElectricityBillService';

const billService = new ElectricityBillService();

export default class ElectricityBillController extends BaseController {
	public basePath: string = '/electricity-bills';

	public routes(): RouteDefinition[] {
		return [
			{ path: '/', method: 'get', handler: this.getAllBills.bind(this) },
			{ path: '/:id', method: 'get', handler: this.getBillById.bind(this) },
		];
	}

	async getAllBills(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const bills = await billService.getAllBills();
			this.send(res, 200, bills);
		} catch (error) {
			next(error);
		}
	}

	async getBillById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const billId = req.params.id;
			const bill = await billService.getBillById(billId);
			if (!bill) {
				res.sendStatus(404);
				return;
			}
			this.send(res, 200, bill);
		} catch (error) {
			next(error);
		}
	}
}