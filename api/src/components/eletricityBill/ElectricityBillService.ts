import { ElectricityBill, ElectricityBillAttributes, ElectricityBillCreationAttributes } from '../../database/models/ElectricityBill';
import logger from '../../lib/logger';
import pdfParse from 'pdf-parse';
import { CreateElectricityBillDTO, ElectricityBillPDF } from './types';
import fs from 'fs';

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

	async extractDataFromPDF(filePath: string, saveToDatabase: boolean = false): Promise<ElectricityBillPDF> {
		try {
			const dataBuffer = fs.readFileSync(filePath);
			const pdfData = await pdfParse(dataBuffer);
			const { text } = pdfData;

			const { noCliente_nInstalacao_Matches, mesRef_Vencimento_Valor_Matches, energiaEletrica_Qntd_Preco_Valor_Matches, energiaICMS_Qntd_Preco_Valor_Matches, energiaCompensada_Qntd_Preco_Valor_Matches, contribIlumMatches, codBarrasMatches } = this.matchData(text);


			const data = {
				pdfUrl: filePath,
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
				codBarras: codBarrasMatches?.[0] ?? null,
			}

			if (saveToDatabase) {
				await this.createByPDFData(data);
			}

			return data;
		} catch (error) {
			console.error('Error parsing PDF:', error);
			fs.unlinkSync(filePath);
			throw error;
		}
	}

	async createByPDFData(data: ElectricityBillPDF): Promise<ElectricityBillAttributes> {
		try {
			const { noDoCliente, noDaInstalacao, mesReferente, vencimento, valorAPagar, energiaEletrica, enegiaICMS, energiaCompensada, contribIlum, codBarras } = data;

			const billData: CreateElectricityBillDTO = {
				pdfUrl: data.pdfUrl,
				pdfText: data.text,
				clientNumber: noDoCliente,
				installationNumber: noDaInstalacao,
				referenceMonth: mesReferente,
				dueDate: vencimento,
				barCode: codBarras,

				energyAmount: energiaEletrica.quantidade,
				energyPrice: energiaEletrica.preco,
				energyTotal: energiaEletrica.valor,

				energyICMSAmount: enegiaICMS.quantidade,
				energyICMSPrice: enegiaICMS.preco,
				energyICMSTotal: enegiaICMS.valor,

				energyCompensatedAmount: energiaCompensada.quantidade,
				energyCompensatedPrice: energiaCompensada.preco,
				energyCompensatedTotal: energiaCompensada.valor,

				publicLightingContribution: contribIlum,

				totalPrice: valorAPagar,
			}

			const bill = await this.create(billData);

			return bill;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(data: CreateElectricityBillDTO): Promise<ElectricityBillAttributes> {
		try {
			if (data.clientNumber && data.installationNumber) {
				const { pdfText, pdfUrl, ...findData } = data;
				const existingBill = await ElectricityBill.findOne({
					where: {
						...findData
					}
				});

				if (existingBill) {
					// throw new Error('Bill already exists');
				}
			}
			const bill = await ElectricityBill.create(data);
			return bill;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	matchData(text: string) {
		const noCliente_nInstalacao_Pattern = /Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\s+(\d+)\s+(\d+)/
		const mesRef_Vencimento_Valor_Pattern = /Referente a\s+Vencimento\s+Valor a pagar \(R\$\)\s+([A-Z]{3}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(\d+[,.]?\d+)/
		const energiaEletrica_Qntd_Preco_Valor_Pattern = /Energia ElétricakWh\s+(\d+[,.]?\d*)\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)/;

		const energiaICMS_Qntd_Preco_Valor_Pattern = /ICMSkWh\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)/;
		const enCompICMS_Qntd_Preco_Valor_Pattern = /En comp. s\/ ICMSkWh\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)/;
		const energiaIsenta_Qntd_Preco_Valor_Pattern = /ISENTAkWh\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)/;


		const energiaCompensada_Qntd_Preco_Valor_Pattern = /Energia compensada GD IkWh\s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)\s+(-\d+[,.]?\d+)/; // negative value
		const energiaInjetada_Qntd_Preco_Valor_Pattern = /Energia injetada HFPkWh \s+(\d+[,.]?\d+)\s+(\d+[,.]?\d+)\s+(-\d+[,.]?\d+)/; // negative value

		const contribIlumPattern = /Contrib Ilum Publica Municipal\s+(\d+[,.]?\d+)/;
		const codBarrasPattern = /(\d{11}-\d \d{11}-\d \d{11}-\d \d{11}-\d)/;


		const extractData = (text: string, pattern: RegExp) => {
			const match = text.match(pattern);
			return match ? match.slice(1,) : null;
		};

		const noCliente_nInstalacao_Matches = extractData(text, noCliente_nInstalacao_Pattern);
		const mesRef_Vencimento_Valor_Matches = extractData(text, mesRef_Vencimento_Valor_Pattern);
		const energiaEletrica_Qntd_Preco_Valor_Matches = extractData(text, energiaEletrica_Qntd_Preco_Valor_Pattern);

		const energiaICMS_Qntd_Preco_Valor_Matches = extractData(text, energiaICMS_Qntd_Preco_Valor_Pattern);
		const enCompICMS_Qntd_Preco_Valor_Matches = extractData(text, enCompICMS_Qntd_Preco_Valor_Pattern);
		const energiaIsenta_Qntd_Preco_Valor_Matches = extractData(text, energiaIsenta_Qntd_Preco_Valor_Pattern);

		const energiaCompensada_Qntd_Preco_Valor_Matches = extractData(text, energiaCompensada_Qntd_Preco_Valor_Pattern);
		const energiaInjetada_Qntd_Preco_Valor_Matches = extractData(text, energiaInjetada_Qntd_Preco_Valor_Pattern);

		const contribIlumMatches = extractData(text, contribIlumPattern);
		const codBarrasMatches = extractData(text, codBarrasPattern);

		return {
			noCliente_nInstalacao_Matches,
			mesRef_Vencimento_Valor_Matches,
			energiaEletrica_Qntd_Preco_Valor_Matches,

			energiaICMS_Qntd_Preco_Valor_Matches: energiaICMS_Qntd_Preco_Valor_Matches?.length ? energiaICMS_Qntd_Preco_Valor_Matches : enCompICMS_Qntd_Preco_Valor_Matches?.length ? enCompICMS_Qntd_Preco_Valor_Matches : energiaIsenta_Qntd_Preco_Valor_Matches,

			energiaCompensada_Qntd_Preco_Valor_Matches: energiaCompensada_Qntd_Preco_Valor_Matches?.length ? energiaCompensada_Qntd_Preco_Valor_Matches : energiaInjetada_Qntd_Preco_Valor_Matches,

			contribIlumMatches,
			codBarrasMatches,
		}
	}
}
