export interface ParamsCallRpc {
  jsonrpc: string;
  id: number;
  method: string;
  params: object;
}
