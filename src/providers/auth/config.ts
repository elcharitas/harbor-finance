import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

export const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
