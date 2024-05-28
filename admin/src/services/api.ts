import axios from 'axios';

const getAPIClient = async () => {

    const api = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    return api;
};

export default getAPIClient;
