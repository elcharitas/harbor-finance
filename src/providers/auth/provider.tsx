import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
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
        avatar={() => null}
        chains={chains}
        theme={theme}
        modalSize="compact"
        appInfo={{
          appName: CONFIG.APP.NAME,
          learnMoreUrl: "/docs/wallets",
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default AuthProvider;
