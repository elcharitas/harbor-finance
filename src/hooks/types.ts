export interface ContractMeta<K, D> {
  functionName: K;
  args?: D extends (...args: any[]) => any ? Parameters<D> : unknown[];
}

export type ContractResult<D> = D extends (...args: any[]) => any
  ? ReturnType<D>
  : unknown;
