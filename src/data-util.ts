import {Directory, DirectoryOrFile, FormattedData, RawData} from "../types";

const addNodeToTree = (currentDir: DirectoryOrFile[], paths: string[], fileName: string) => {
    if (paths.length === 0) {
        if (fileName) {
            currentDir.push(fileName);
        }
        return;
    }

    const [dir, ...rest] = paths;
    let existingDir = currentDir.find(
        (item: DirectoryOrFile): item is Directory => typeof item === 'object' && item.hasOwnProperty(dir)
    );

    if (!existingDir) {
        existingDir = { [dir]: [] };
        currentDir.push(existingDir);
    }

    addNodeToTree((existingDir as Directory)[dir], rest, fileName);
};

export const transformData = (data: RawData): FormattedData => {
    const result: FormattedData = {};

    data.items.forEach(({ fileUrl }) => {
        const urlObject:URL = new URL(fileUrl);
        const { hostname, pathname } = urlObject;
        const IP:string = hostname;
        const paths:string[] = pathname.split('/').filter(Boolean);
        const isDirectory:boolean = fileUrl.endsWith('/');
        const fileName:string = isDirectory ? '' : paths.pop()!;

        if (!result[IP]) {
            result[IP] = [];
        }

        if (isDirectory) {
            addNodeToTree(result[IP], paths, '');
        } else {
            // if file
            addNodeToTree(result[IP], paths, fileName);
        }
    });

    return result;
};