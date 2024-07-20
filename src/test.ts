const addToStructure = (structure: any[], paths: string[], fileName: string) => {
    if (paths.length === 0) {
        structure.push(fileName);
        return;
    }

    const [dir, ...rest] = paths;
    let existingDir = structure.find((item) => typeof item === 'object' && item[dir]);

    if (!existingDir) {
        existingDir = { [dir]: [] };
        structure.push(existingDir);
    }

    addToStructure(existingDir[dir], rest, fileName);
};

const transformData = (data: string[]) => {
    const result: Record<string, any[]> = {};

    data.forEach((url) => {
        const urlObj = new URL(url);
        const ip = urlObj.hostname;
        const paths = urlObj.pathname.split('/').filter(Boolean);
        const fileName = paths.pop();

        if (!result[ip]) {
            result[ip] = [];
        }

        addToStructure(result[ip], paths, fileName!);
    });

    return result;
};