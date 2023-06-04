const NETWORK_CONFIG = {
  ID: process.env.NEXT_PUBLIC_NETWORK_ID,
  RPC_URL: String(process.env.NEXT_PUBLIC_QUICK_NODE_URL),
};

export default NETWORK_CONFIG;
