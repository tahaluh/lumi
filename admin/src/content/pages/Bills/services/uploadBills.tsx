import getAPIClient from "src/services/api";
import { getMessageFromError } from "src/utils/error";
import { ServiceResponse } from "src/utils/types/serviceResponse";
import { ElectricityBillAttributes } from "../types/ElectricityBill";

interface UploadBillsResponse {
    data: ElectricityBillAttributes
    fileName: string
}

export async function UploadBills(
    files: File[]
): Promise<ServiceResponse<{ failed: UploadBillsResponse[], succeeded: UploadBillsResponse[] }>> {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        const api = await getAPIClient();
        const res = await api.post(`/api/v1/electricity-bills/upload-multiple`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            data: res.data,
            error: null,
        };
    } catch (e) {
        return {
            data: null,
            error: e,
        };
    }
}

