import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig } from "wagmi";
import { hardhat, polygonMumbai } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";
import CONFIG from "src/configs";

export const { chains, publicClient } = configureChains(
  // switch to hardhat for local development
  [CONFIG.APP.IS_DEV ? hardhat : polygonMumbai],
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
