import getAPIClient from './api';

export const fetcher = async (url: string) => {
    const api = await getAPIClient();

    return api.get(url).then((res) => res.data);
};

export const infiniteListFetcher = async (url: string) => {
    const api = await getAPIClient();

    return api.get(url).then((res) => res.data.body);
};
