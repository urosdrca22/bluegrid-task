type item = {fileUrl: string}
type DirectoryOrFile = Directory | string;
type Directory = { [key: string]: DirectoryOrFile[] };
export interface rawData {
    items: item[]
}
export interface FormattedData {
    [ip: string]: DirectoryOrFile[];
}



