import getAPIClient from "src/services/api";
import { ServiceResponse } from "src/utils/types/serviceResponse";

export const downloadBill = async (
    uuid: string
): Promise<ServiceResponse<null>> => {
    try {
        const api = await getAPIClient();
        const response = await api.get(`/api/v1/electricity-bills/download/${uuid}`, {
            responseType: 'blob',
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `bill_${uuid}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return {
                data: null,
                error: null,
            };
        } else {
            throw new Error('Failed to download bill');
        }
    } catch (e) {
        return {
            data: null,
            error: e,
        };
    }
};
