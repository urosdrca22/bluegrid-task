// cache.ts
const CACHE_TTL = 60000; // 60 seconds

// Cache object to store data with timestamps
const cache: { [key: string]: { data: any; timestamp: number } } = {};

// Function to get data from cache
export const getFromCache = (key: string) => {
    const now = Date.now();
    const cached = cache[key];

    if (cached && now - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
};

// Function to set data in cache
export const setInCache = (key: string, data: any) => {
    cache[key] = {
        data,
        timestamp: Date.now(),
    };
};
