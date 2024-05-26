import { ElectricityBill, ElectricityBillAttributes, ElectricityBillCreationAttributes } from '../../database/models/ElectricityBill';
import logger from '../../lib/logger';

export class ElectricityBillService {
	async getAllBills(): Promise<ElectricityBillAttributes[]> {
		try {
			const bills = await ElectricityBill.findAll();
			return bills;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getBillById(id: string | number): Promise<ElectricityBillAttributes> {
		try {
			const bill = await ElectricityBill.findByPk(id);
			if (!bill) {
				throw new Error('Bill not found');
			}
			return bill;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
