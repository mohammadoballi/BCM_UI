export interface BaseResponse<T> {
    isSuccess: boolean;
    message_ar: string;
    message_en: string;
    data: T;
    pagination?: Pagination;
}

export interface Pagination {
    total: number;
    index: number;
    size: number;
    totalpages: number;
}
