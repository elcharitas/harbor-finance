"use client";
import { FC } from "react";
import { SaasProvider } from "@saas-ui/react";
import { ColorModeScript } from "@chakra-ui/react";

import theme from "src/theme";
import AuthProvider from "../auth/provider";

const AppProvider: FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <SaasProvider theme={theme}>
      <AuthProvider>{children}</AuthProvider>
    </SaasProvider>
  </>
);

export default AppProvider;
