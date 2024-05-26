import { Request, Response, NextFunction } from 'express';
import BaseController from '../BaseController';
import { RouteDefinition } from '../../types/RouteDefinition';
import { ElectricityBillService } from './ElectricityBillService';
import multer from 'multer';
import { storage } from '../../configs/multerConfig';

const billService = new ElectricityBillService();
const upload = multer({ storage: storage });

export default class ElectricityBillController extends BaseController {
	public basePath: string = 'electricity-bills';

	public routes(): RouteDefinition[] {
		return [
			{ path: '/', method: 'get', handler: this.getAllBills.bind(this) },
			{ path: '/:id', method: 'get', handler: this.getBillById.bind(this) },
			{ path: '/upload', method: 'post', handler: [upload.single('file'), this.uploadFile.bind(this)] },
			{
				path: '/upload-multiple',
				method: 'post',
				handler: [upload.array('files', 12), this.uploadMultipleFiles.bind(this)],
			},
			{
				path: '/client/:clientNumber/dashboard',
				method: 'get',
				handler: this.getClientDashboard.bind(this),
			}
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

	async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!req.file) {
				res.status(400).send('No file uploaded.');
				return;
			}

			const filePath = req.file.path;
			const extractedData = await billService.extractDataFromPDF(filePath, true);

			res.status(200).json(extractedData);
		} catch (error) {
			next(error);
		}
	}

	async uploadMultipleFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!req.files) {
				res.status(400).send('No files uploaded.');
				return;
			}

			if (!Array.isArray(req.files)) {
				res.status(400).send('Files must be an array.');
				return;
			}

			const filePaths = req.files.map((file: Express.Multer.File) => file.path);
			const extractedData = await Promise.all(
				filePaths.map((filePath) => billService.extractDataFromPDF(filePath, true)),
			);

			res.status(200).json(extractedData);
		} catch (error) {
			next(error);
		}
	}

	async getClientDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const clientNumber = req.params.clientNumber;
			const dashboardData = await billService.getClientDashboard(clientNumber);
			this.send(res, 200, dashboardData);
		} catch (error) {
			next(error);
		}
	}
}
