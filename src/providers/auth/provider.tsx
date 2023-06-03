import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { Avatar } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";

import CONFIG from "src/configs";
import { wagmiConfig, chains } from "./config";
import { theme } from "./theme";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={theme}
        chains={chains}
        modalSize="compact"
        appInfo={{
          appName: CONFIG.APP.NAME,
          learnMoreUrl: "/docs#wallets",
        }}
        avatar={({ ensImage, address }) => (
          <Avatar name={address} src={ensImage ?? address} />
        )}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default AuthProvider;
