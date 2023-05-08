import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import CONFIG from "src/configs";

export const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

export const { connectors } = getDefaultWallets({
  appName: CONFIG.APP.NAME,
  projectId: "YOUR_PROJECT_ID",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
