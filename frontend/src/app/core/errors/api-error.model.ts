export interface ApiError {
    status: number;
    code?: string;
    message: string;
    details?: Record<string, any> | string[];
    url?: string;
}
