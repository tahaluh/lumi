export type SearchParams = {
    [key: string]:
    | string
    | number
    | undefined
    | null
    | SearchParams
    | boolean
    | Array<string | number>;
};

