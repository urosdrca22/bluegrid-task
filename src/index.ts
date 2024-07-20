import express from 'express';
import { getFiles, fetchData, transformData } from './api'; // Import functions
import { getFromCache, setInCache } from './cache';

const app = express();
const port = 3000;

// Middleware to check the cache
const cacheMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cacheKey = '/api/files';
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
        // Serve from cache
        return res.json(cachedData);
    }

    // If cache is expired or doesn't exist, continue to the route handler
    next();
};

// Apply the cache middleware to the /api/files route
app.get('/api/files', cacheMiddleware, getFiles);

// Function to prefetch data and populate cache
const prefetchData = async () => {
    try {
        const data = await fetchData(); // Fetch fresh data
        const transformedData = transformData(data); // Transform data
        setInCache('/api/files', transformedData); // Cache the transformed data
        console.log('Data pre-fetched and cached successfully.');
    } catch (error) {
        console.error('Error during data prefetching:', error);
    }
};

// Prefetch data on server start
prefetchData();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
