
import { DeepPartial } from 'react-hook-form';
import { parseSearchParams } from 'src/utils/parseSearchParams';
import useSWR, { SWRResponse } from 'swr';

export type PossibleParams = {
    clientNumber: string;
    year: number | string;
};

export const fetchDashboardData = (
    filter?: DeepPartial<PossibleParams>
): SWRResponse<ClientDashboardResponse> => {
    const parsedParams = parseSearchParams(filter ?? {});
    const response = useSWR<ClientDashboardResponse, Error>(`/api/v1/electricity-bills/dashboard?${parsedParams}`);


    return response;
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