import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

import { wagmiConfig, chains } from "./config";
import { theme } from "./theme";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={theme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default AuthProvider;
