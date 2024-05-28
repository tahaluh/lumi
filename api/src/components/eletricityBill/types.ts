export type CreateElectricityBillDTO = {
    pdfUrl: string;
    pdfText: string;

    clientNumber: string;
    installationNumber: string;

    referenceYear: number;
    referenceMonth: number;
    dueDate: string;

    energyAmount: number;
    energyPrice: number;
    energyTotal: number;

    energyICMSAmount: number;
    energyICMSPrice: number;
    energyICMSTotal: number;

    energyCompensatedAmount: number;
    energyCompensatedPrice: number;
    energyCompensatedTotal: number;

    publicLightingContribution: number;

    totalPrice: number;

    barCode: string;
};

export type FilterQueryParams = { limit?: string, offset?: string, clientNumber: string, year: string };


export type ElectricityBillPDF = {
    pdfUrl: string;
    text: string;
    noDoCliente: string | null;
    noDaInstalacao: string | null;
    anoReferente: string | null;
    mesReferente: string | null;
    vencimento: string | null;
    valorAPagar: string | null;
    energiaEletrica: {
        quantidade: string | null;
        preco: string | null;
        valor: string | null;
    };
    enegiaICMS: {
        quantidade: string | null;
        preco: string | null;
        valor: string | null;
    };
    energiaCompensada: {
        quantidade: string | null;
        preco: string | null;
        valor: string | null;
    };
    contribIlum: string | null;
    codBarras: string | null;
};

export type ClientDashboardResponse = {
    clientNumber: string;
    nOfBills: number;

    data: ElectricityBillDashboardDataByDate[];
    totals: TotalElectricityBillDashboardData;
};

export type ElectricityBillDashboardDataByDate = {
    referenceYear: number;
    referenceMonth: number;
} & TotalElectricityBillDashboardData;

export type TotalElectricityBillDashboardData = {
    energyAmount: number;
    energyPrice: number;
    energyTotal: number;

    energyICMSAmount: number;
    energyICMSPrice: number;
    energyICMSTotal: number;

    energyCompensatedAmount: number;
    energyCompensatedPrice: number;
    energyCompensatedTotal: number;

    publicLightingContribution: number;

    totalPrice: number;
}