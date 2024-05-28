export type ElectricityBillAttributes = {
    uuid: string;
    clientNumber: string | null;
    installationNumber: string | null;
    referenceYear: number | null;
    referenceMonth: number | null;
    dueDate: string | null;
    energyAmount: number | null;
    energyPrice: number | null;
    energyTotal: number | null;
    energyICMSAmount: number | null;
    energyICMSPrice: number | null;
    energyICMSTotal: number | null;
    energyCompensatedAmount: number | null;
    energyCompensatedPrice: number | null;
    energyCompensatedTotal: number | null;
    publicLightingContribution: number | null;
    totalPrice: number | null;
    barCode: string | null;
    pdfUrl: string | null;
    pdfText: string | null;
}