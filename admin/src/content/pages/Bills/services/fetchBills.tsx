
import { DeepPartial } from 'react-hook-form';
import { parseSearchParams } from 'src/utils/parseSearchParams';
import useSWR, { SWRResponse } from 'swr';
import { ElectricityBillAttributes } from '../types/ElectricityBill';

export type PossibleParams = {
    limit: number;
    offset: number;
    clientNumber: string;
    year: number | string;
};

export const fetchBills = (
    filter?: DeepPartial<PossibleParams>
): SWRResponse<ElectricityBillAttributes[]> => {
    const parsedParams = parseSearchParams(filter ?? {});
    const response = useSWR<ElectricityBillAttributes[], Error>(`/api/v1/electricity-bills/?${parsedParams}`);

    return response;
};