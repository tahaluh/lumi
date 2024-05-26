export type CreateElectricityBillDTO = {
    pdfUrl: string;
    pdfText: string;

    clientNumber: string;
    installationNumber: string;

    referenceMonth: string;
    dueDate: string;

    energyAmount: string;
    energyPrice: string;
    energyTotal: string;

    energyICMSAmount: string;
    energyICMSPrice: string;
    energyICMSTotal: string;

    energyCompensatedAmount: string;
    energyCompensatedPrice: string;
    energyCompensatedTotal: string;

    publicLightingContribution: string;

    totalPrice: string;

    barCode: string;
};

export type FilterQueryParams = { startDate: string, endDate: string, limit?: string, offset?: string }


export type ElectricityBillPDF = {
    pdfUrl: string;
    text: string;
    noDoCliente: string | null;
    noDaInstalacao: string | null;
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

    data: ElectricityBillDashboardData[];
    totals: ElectricityBillDashboardData;
};

export type ElectricityBillDashboardData = {
    referenceMonth: string;

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