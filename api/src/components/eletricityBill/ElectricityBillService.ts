import { ElectricityBill, ElectricityBillAttributes, ElectricityBillCreationAttributes } from '../../database/models/ElectricityBill';
import logger from '../../lib/logger';
import pdfParse from 'pdf-parse';

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

	async extractDataFromPDF(dataBuffer: Buffer) {
		try {
			const pdfData = await pdfParse(dataBuffer);
			const { text } = pdfData;

			// Extract data from the pdf text with regex
			const noCliente_nInstalacao_Pattern = /Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\s+(\d+)\s+(\d+)/
			const mesRef_Vencimento_Valor_Pattern = /Referente a\s+Vencimento\s+Valor a pagar \(R\$\)\s+([A-Z]{3}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(\d+[,.]?\d+)/
			const energiaEletrica_Qntd_Preco_Valor_Pattern = /Energia ElétricakWh\s+(\d+[,.]?\d*)\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)/;
			const energiaICMS_Qntd_Preco_Valor_Pattern = /Energia SCEE s\/ ICMSkWh\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)/;
			const energiaCompensada_Qntd_Preco_Valor_Pattern = /Energia compensada GD IkWh\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)\s+(-\d+[,.]?\d+)/;
			const contribIlumPattern = /Contrib Ilum Publica Municipal\s+(\d+[,.]?\d+)/;


			const extractData = (text: string, pattern: RegExp) => {
				const match = text.match(pattern);
				return match ? match.slice(1,) : null;
			};

			const noCliente_nInstalacao_Matches = extractData(text, noCliente_nInstalacao_Pattern);
			const mesRef_Vencimento_Valor_Matches = extractData(text, mesRef_Vencimento_Valor_Pattern);
			const energiaEletrica_Qntd_Preco_Valor_Matches = extractData(text, energiaEletrica_Qntd_Preco_Valor_Pattern);
			const energiaICMS_Qntd_Preco_Valor_Matches = extractData(text, energiaICMS_Qntd_Preco_Valor_Pattern);
			const energiaCompensada_Qntd_Preco_Valor_Matches = extractData(text, energiaCompensada_Qntd_Preco_Valor_Pattern);
			const contribIlumMatches = extractData(text, contribIlumPattern);

			return {
				text,
				noDoCliente: noCliente_nInstalacao_Matches?.[0] ?? null,
				noDaInstalacao: noCliente_nInstalacao_Matches?.[1] ?? null,
				mesReferente: mesRef_Vencimento_Valor_Matches?.[0] ?? null,
				vencimento: mesRef_Vencimento_Valor_Matches?.[1] ?? null,
				valorAPagar: mesRef_Vencimento_Valor_Matches?.[2] ?? null,
				energiaEletrica: {
					quantidade: energiaEletrica_Qntd_Preco_Valor_Matches?.[0] ?? null,
					preco: energiaEletrica_Qntd_Preco_Valor_Matches?.[1] ?? null,
					valor: energiaEletrica_Qntd_Preco_Valor_Matches?.[2] ?? null,
				},
				enegiaICMS: {
					quantidade: energiaICMS_Qntd_Preco_Valor_Matches?.[0] ?? null,
					preco: energiaICMS_Qntd_Preco_Valor_Matches?.[1] ?? null,
					valor: energiaICMS_Qntd_Preco_Valor_Matches?.[2] ?? null,
				},
				energiaCompensada: {
					quantidade: energiaCompensada_Qntd_Preco_Valor_Matches?.[0] ?? null,
					preco: energiaCompensada_Qntd_Preco_Valor_Matches?.[1] ?? null,
					valor: energiaCompensada_Qntd_Preco_Valor_Matches?.[2] ?? null,
				},
				contribIlum: contribIlumMatches?.[0] ?? null,
			};
		} catch (error) {
			console.error('Error parsing PDF:', error);
			throw error;
		}
	}
}
