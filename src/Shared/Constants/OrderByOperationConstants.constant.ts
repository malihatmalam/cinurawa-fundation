export enum OrderByOperationConstants {
    Asc = 'asc',
    Desc = 'desc'
}

export interface OrderBy {
    field: string;
    direction: OrderByOperationConstants
}

export interface PaginationOptions {
    page: number;
    pageSize: number;
    orderBy?: OrderBy[];
}