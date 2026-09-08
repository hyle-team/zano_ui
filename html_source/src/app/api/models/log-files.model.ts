export interface LogFilesResponse {
    error_code: string;
}

export interface LogFilesSizeResponse extends LogFilesResponse {
    response_data?: {
        total_size: number;
    };
}
