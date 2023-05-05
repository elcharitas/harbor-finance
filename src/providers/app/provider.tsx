"use client";
import { SaasProvider } from "@saas-ui/react";
import { FC } from "react";
import theme from "src/theme";

const AppProvider: FC<{ children: React.ReactNode }> = ({ children }) => (
  <SaasProvider theme={theme}>{children}</SaasProvider>
);

export default AppProvider;
