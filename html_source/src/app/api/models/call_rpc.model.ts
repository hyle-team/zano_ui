export interface ParamsCallRpc {
    jsonrpc: string;
    id: number;
    method: string;
    params: object | any;
}

export interface ResponseCallRpc<T = any> {
    jsonrpc: string;
    id: number;
    result: T;
}


