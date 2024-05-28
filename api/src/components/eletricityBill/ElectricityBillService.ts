import { ElectricityBill, ElectricityBillAttributes, ElectricityBillCreationAttributes } from '../../database/models/ElectricityBill';
import logger from '../../lib/logger';
import pdfParse from 'pdf-parse';
import { ClientDashboardResponse, CreateElectricityBillDTO, ElectricityBillDashboardDataByDate, ElectricityBillPDF, FilterQueryParams } from './types';
import fs from 'fs';
import { shortMonths } from '../../utils/months';
import ApiError from '../../abstractions/ApiError';


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

			const sliptedMonth = mesRef_Vencimento_Valor_Matches?.[0]?.split('/')[0] ?? null
			const sliptedYear = mesRef_Vencimento_Valor_Matches?.[0]?.split('/')[1] ?? null

			const rawData = {
				pdfUrl: filePath,
				text,
				noDoCliente: noCliente_nInstalacao_Matches?.[0] ?? null,
				noDaInstalacao: noCliente_nInstalacao_Matches?.[1] ?? null,
				anoReferente: sliptedYear,
				mesReferente: sliptedMonth,
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


			const billData: CreateElectricityBillDTO = {
				pdfUrl: rawData.pdfUrl,
				pdfText: rawData.text,
				clientNumber: rawData.noDoCliente,
				installationNumber: rawData.noDaInstalacao,
				referenceYear: rawData.anoReferente ? parseInt(rawData.anoReferente) : null,
				referenceMonth: rawData.mesReferente ? shortMonths.indexOf(rawData.mesReferente) + 1 : null,
				dueDate: rawData.vencimento,
				barCode: rawData.codBarras,
				// save the parseFloat number or if its null, save null
				energyAmount: rawData.energiaEletrica.quantidade ? parseFloat(rawData.energiaEletrica.quantidade.replace('.', '').replace(',', '.')) : null,
				energyPrice: rawData.energiaEletrica.preco ? parseFloat(rawData.energiaEletrica.preco.replace('.', '').replace(',', '.')) : null,
				energyTotal: rawData.energiaEletrica.valor ? parseFloat(rawData.energiaEletrica.valor.replace('.', '').replace(',', '.')) : null,

				energyICMSAmount: rawData.enegiaICMS.quantidade ? parseFloat(rawData.enegiaICMS.quantidade.replace('.', '').replace(',', '.')) : null,
				energyICMSPrice: rawData.enegiaICMS.preco ? parseFloat(rawData.enegiaICMS.preco.replace('.', '').replace(',', '.')) : null,
				energyICMSTotal: rawData.enegiaICMS.valor ? parseFloat(rawData.enegiaICMS.valor.replace('.', '').replace(',', '.')) : null,

				energyCompensatedAmount: rawData.energiaCompensada.quantidade ? parseFloat(rawData.energiaCompensada.quantidade.replace('.', '').replace(',', '.')) : null,
				energyCompensatedPrice: rawData.energiaCompensada.preco ? parseFloat(rawData.energiaCompensada.preco.replace('.', '').replace(',', '.')) : null,
				energyCompensatedTotal: rawData.energiaCompensada.valor ? parseFloat(rawData.energiaCompensada.valor.replace('.', '').replace(',', '.')) : null,

				publicLightingContribution: rawData.contribIlum ? parseFloat(rawData.contribIlum.replace('.', '').replace(',', '.')) : null,

				totalPrice: rawData.valorAPagar ? parseFloat(rawData.valorAPagar.replace('.', '').replace(',', '.')) : null,
			}

			if (saveToDatabase) {
				await this.createByPDFData(billData);
			}

			return rawData;
		} catch (error) {
			console.error('Error parsing PDF:', error);
			fs.unlinkSync(filePath);
			throw error;
		}
	}
	async createByPDFData(data: CreateElectricityBillDTO): Promise<ElectricityBillAttributes> {
		try {
			const bill = await this.create(data);

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
					throw new ApiError('Bill already exists', 400);
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

	async getClientDashboard(clientNumber?: string, year: string = 'all'): Promise<ClientDashboardResponse> {
		const bills = await ElectricityBill.findAll({
			where: {
				...(clientNumber ? { clientNumber } : {}),
				...(year !== 'all' ? { referenceYear: parseInt(year) } : {})
			}
		});

		const data = bills.map(bill => {
			const { energyAmount, energyCompensatedAmount, energyCompensatedPrice, energyCompensatedTotal, energyICMSAmount, energyICMSPrice, energyICMSTotal, energyPrice, energyTotal, referenceYear, referenceMonth, publicLightingContribution, totalPrice } = bill;
			const dashboardData: ElectricityBillDashboardDataByDate = {
				referenceYear,
				referenceMonth,
				energyAmount: energyAmount,
				energyCompensatedAmount: energyCompensatedAmount,
				energyCompensatedPrice: energyCompensatedPrice,
				energyCompensatedTotal: energyCompensatedTotal,
				energyICMSAmount: energyICMSAmount,
				energyICMSPrice: energyICMSPrice,
				energyICMSTotal: energyICMSTotal,
				energyPrice: energyPrice,
				energyTotal: energyTotal,
				publicLightingContribution: publicLightingContribution,
				totalPrice: totalPrice,
			}
			return dashboardData;
		}).sort((a, b) => {
			const aYear = a.referenceYear ?? 0;
			const bYear = b.referenceYear ?? 0;
			const aMonth = a.referenceMonth ?? 0;
			const bMonth = b.referenceMonth ?? 0;

			if (aYear !== bYear) {
				return aYear - bYear;
			}
			return aMonth - bMonth;
		});

		const totals = data.reduce((acc, curr) => {
			acc.energyAmount += curr.energyAmount;
			acc.energyCompensatedAmount += curr.energyCompensatedAmount;
			acc.energyCompensatedPrice += curr.energyCompensatedPrice / data.length;
			acc.energyCompensatedTotal += curr.energyCompensatedTotal;
			acc.energyICMSAmount += curr.energyICMSAmount;
			acc.energyICMSPrice += curr.energyICMSPrice / data.length;
			acc.energyICMSTotal += curr.energyICMSTotal;
			acc.energyPrice += curr.energyPrice / data.length;
			acc.energyTotal += curr.energyTotal;
			acc.publicLightingContribution += curr.publicLightingContribution;
			acc.totalPrice += curr.totalPrice;
			return acc;
		}, {
			energyAmount: 0,
			energyCompensatedAmount: 0,
			energyCompensatedPrice: 0,
			energyCompensatedTotal: 0,
			energyICMSAmount: 0,
			energyICMSPrice: 0,
			energyICMSTotal: 0,
			energyPrice: 0,
			energyTotal: 0,
			publicLightingContribution: 0,
			totalPrice: 0,
		});



		return {
			clientNumber,
			nOfBills: bills.length,
			data,
			totals,
		}
	}

	async getBillsByClientNumber(clientNumber: string, params: FilterQueryParams): Promise<ElectricityBillAttributes[]> {
		const where: any = {
			clientNumber
		};

		if (params.startDate) {
			where.referenceMonth = {
				...where.referenceMonth,
				$gte: params.startDate
			}
		}

		if (params.endDate) {
			where.referenceMonth = {
				...where.referenceMonth,
				$lte: params.endDate
			}
		}

		const bills = await ElectricityBill.findAll({
			where,
			limit: params.limit ? parseInt(params.limit) : undefined,
			offset: params.offset ? parseInt(params.offset) : undefined,
		});

		return bills;
	}
}
