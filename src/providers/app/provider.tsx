"use client";
import { SaasProvider } from "@saas-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import { FC } from "react";
import theme from "src/theme";

const AppProvider: FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <SaasProvider theme={theme}>{children}</SaasProvider>
  </>
);

export default AppProvider;
