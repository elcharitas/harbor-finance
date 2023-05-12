import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      // @ts-ignore No fix for this yet
      metaMaskWallet({ chains }),
    ],
  },
  {
    groupName: "Others",

    wallets: [
      // @ts-ignore No fix for this yet
      walletConnectWallet({ chains }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
