export type CreateElectricityBillDTO = {
    pdfUrl: string;
    pdfText: string;

    clientNumber: string;
    intallationNumber: string;

    referenceMonth: string;
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