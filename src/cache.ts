import {FormattedData} from "../types";

const cache: { [key: string]: any } = {};

export const getFromCache = (key: string) => {
    return cache[key] || null;
};

export const writeToCache = (key: string, data: FormattedData) => {
    cache[key] = data;
};
