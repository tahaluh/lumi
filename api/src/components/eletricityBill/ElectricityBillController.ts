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
			{
				path: '/dashboard',
				method: 'get',
				handler: this.getDashboard.bind(this),
			},
			{ path: '/:id', method: 'get', handler: this.getBillById.bind(this) },
			{ path: '/client/:clientNumber/', method: 'get', handler: this.getBillsByClientNumber.bind(this) },
			{ path: '/upload', method: 'post', handler: [upload.single('file'), this.uploadFile.bind(this)] },
			{
				path: '/download/:id', method: 'get', handler: this.downloadBill.bind(this),
			},
			{
				path: '/upload-multiple',
				method: 'post',
				handler: [upload.array('files', 12), this.uploadMultipleFiles.bind(this)],
			},
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

			// return a data with suceded and failed count and files names
			const extractedData = await Promise.all(
				filePaths.map(async (filePath) => {
					try {
						const data = await billService.extractDataFromPDF(filePath, true);
						return { data, fileName: filePath.split('_').pop() };
					} catch (error) {
						return { error: error.message, fileName: filePath.split('_').pop() };
					}
				})
			);

			const failed = extractedData.filter((data) => data.error);
			const succeeded = extractedData.filter((data) => !data.error);


			res.status(200).json({ succeeded, failed });
		} catch (error) {
			next(error);
		}
	}

	async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { clientNumber, year } = req.query as { clientNumber: string, year: string };
			const dashboardData = await billService.getClientDashboard(clientNumber, year);
			this.send(res, 200, dashboardData);
		} catch (error) {
			next(error);
		}
	}

	async getBillsByClientNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const clientNumber = req.params.clientNumber;
			const { startDate, endDate, limit, offset } = req.query;

			// Convertendo os valores para string
			const startDateString = startDate as string;
			const endDateString = endDate as string;
			const limitString = limit as string;
			const offsetString = offset as string;

			const bills = await billService.getBillsByClientNumber(clientNumber, {
				startDate: startDateString,
				endDate: endDateString,
				limit: limitString,
				offset: offsetString,
			});
			this.send(res, 200, bills);
		} catch (error) {
			next(error);
		}
	}


	async downloadBill(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const billId = req.params.id;
			const bill = await billService.getBillById(billId);
			if (!bill) {
				res.sendStatus(404);
				return;
			}
			const filePath = bill.pdfUrl;
			res.download(filePath);
		} catch (error) {
			next(error);
		}
	}
}
