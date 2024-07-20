import { Request, Response } from 'express';
import axios from 'axios';
import { FormattedData, RawData} from '../types';
import { getFromCache, writeToCache } from './cache';
import {transformData} from "./data-util";

const API_URL: string = 'https://rest-test-eight.vercel.app/api/test';

export const fetchData = async () => {
    const response = await axios.get(API_URL);
    return response.data
};

export const getFiles = async (req: Request, res: Response) => {
    try {
        const cacheKey = '/api/files';
        const cachedData: FormattedData = getFromCache(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data: RawData = await fetchData();
        const transformedData: FormattedData = transformData(data);

        writeToCache(cacheKey, transformedData);
        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
