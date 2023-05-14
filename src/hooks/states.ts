import { createGlobalState } from "./use-global-state";

export const useWithdrawalState = createGlobalState("harbor.withdrawal");

export const useDepositState = createGlobalState("harbor.deposit");
