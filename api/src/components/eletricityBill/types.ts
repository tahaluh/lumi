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