type item = {fileUrl: string}

type DirectoryOrFile = Directory | string;

type Directory = { [key: string]: DirectoryOrFile[] };
export interface RawData {
    items: item[]
}
export interface FormattedData {
    [ip: string]: DirectoryOrFile[];
}



