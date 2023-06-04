import { ContractAddress } from "src/hooks/types";

const CONTRACTS_CONFIG: Record<string, ContractAddress> = {
  SAVINGS_GOAL_FACTORY: process.env
    .NEXT_PUBLIC_SAVINGS_GOAL_FACTORY_ADDRESS as ContractAddress,
};

export default CONTRACTS_CONFIG;
