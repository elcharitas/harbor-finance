export type ContractAddress = `0x${string}`;

export type PromiseReturnType<T extends Promise<unknown>> = T extends Promise<
  infer type
>
  ? type extends Promise<unknown>
    ? PromiseReturnType<type>
    : type
  : never;

export interface ContractMeta<K, D> {
  functionName: K;
  args?: D extends (...args: any[]) => any ? Parameters<D> : unknown[];
}

export type ContractResult<D> = D extends (...args: any[]) => any
  ? PromiseReturnType<ReturnType<D>>
  : unknown;
