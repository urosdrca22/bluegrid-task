import express from 'express';
import { getFiles, fetchData } from './api';
import { getFromCache, writeToCache } from './cache';
import {transformData} from "./data-util";

const app = express();
const port = 3000;

const cacheMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cacheKey = '/api/files';
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    next();
};

app.get('/api/files', cacheMiddleware, getFiles);

const prefetchData = async () => {
    try {
        const data = await fetchData()
        const transformedData = transformData(data)
        writeToCache('/api/files', transformedData)
        console.log('Data pre-fetched and cached successfully.')
    } catch (error) {
        console.error('An error was encountered during data prefetching:', error);
    }
};

prefetchData();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
