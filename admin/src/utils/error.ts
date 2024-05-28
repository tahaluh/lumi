import { AxiosError } from 'axios';

export const getMessageFromError = (error: unknown) => {
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof AxiosError) {
        return error.response?.data?.message ?? error.message;
    }
    return 'An unknown error occurred.';
};

export const getFormattedError = (
    error: unknown
): { message: string; status?: number } => {
    if (error instanceof AxiosError) {
        return {
            status: error.response?.status,
            message: error.response?.data.error.message,
        };
    }
    if (error instanceof Error) {
        return {
            message: `${error.name ?? 'Error'}: ${error.message}`,
        };
    }
    if (typeof error === 'string') {
        return {
            message: error,
        };
    }
    return { message: 'An unknown error occurred.' };
};
