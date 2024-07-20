import { Request, Response } from 'express';
import axios from 'axios';
import { Directory, DirectoryOrFile, FormattedData, rawData } from '../types';
import { getFromCache, setInCache } from './cache';

const API_URL = 'https://rest-test-eight.vercel.app/api/test';

// Fetch data from the API
export const fetchData = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Add a node to the directory tree
const addNodeToTree = (currentDir: DirectoryOrFile[], paths: string[], fileName: string) => {
    if (paths.length === 0) {
        if (fileName) {
            currentDir.push(fileName);
        }
        return;
    }

    const [dir, ...rest] = paths;
    let existingDir = currentDir.find(
        (item): item is Directory => typeof item === 'object' && item.hasOwnProperty(dir)
    );

    if (!existingDir) {
        existingDir = { [dir]: [] };
        currentDir.push(existingDir);
    }

    addNodeToTree((existingDir as Directory)[dir], rest, fileName);
};

// Transform raw data into the desired structure
export const transformData = (data: rawData): FormattedData => {
    const result: FormattedData = {};

    data.items.forEach(({ fileUrl }) => {
        const urlObject = new URL(fileUrl);
        const { hostname, pathname } = urlObject;
        const IP = hostname;
        const paths = pathname.split('/').filter(Boolean);
        const isDirectory = fileUrl.endsWith('/');
        const fileName = isDirectory ? '' : paths.pop()!;

        if (!result[IP]) {
            result[IP] = [];
        }

        if (isDirectory) {
            // Handle directories
            addNodeToTree(result[IP], paths, '');
        } else {
            addNodeToTree(result[IP], paths, fileName);
        }
    });

    return result;
};

// Handler for the /api/files route
export const getFiles = async (req: Request, res: Response) => {
    try {
        const cacheKey = '/api/files';
        const cachedData = getFromCache(cacheKey);

        if (cachedData) {
            // Serve from cache
            return res.json(cachedData);
        }

        // Fetch fresh data and update the cache
        const data: rawData = await fetchData();
        const transformedData = transformData(data);

        // Update cache
        setInCache(cacheKey, transformedData);

        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
