const CONTRACTS_CONFIG: Record<string, `0x${string}`> = {
  SAVINGS_GOAL_FACTORY: process.env.NEXT_PUBLIC_SAVINGS_GOAL_FACTORY_ADDRESS as `0x${string}`,
};

export default CONTRACTS_CONFIG;
