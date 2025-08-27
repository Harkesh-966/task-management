export const apiSuccess = (data: unknown, meta: Record<string, unknown> = {}) => ({
    success: true,
    data,
    meta
});

export const apiError = (message: string, details?: unknown) => ({
    success: false,
    message,
    details
});
