import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

import { SkipNavContent, SkipNavLink } from "@chakra-ui/skip-nav";

import { Header, HeaderProps } from "./header";
import { Footer, FooterProps } from "./footer";

export interface LayoutProps {
  children: ReactNode;
  headerProps: HeaderProps;
  footerProps: FooterProps;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  headerProps,
  footerProps,
}) => {
  return (
    <Box>
      <SkipNavLink>Skip to content</SkipNavLink>
      <Header {...headerProps} />
      <Box as="main">
        <SkipNavContent />
        {children}
      </Box>
      <Footer {...footerProps} />
    </Box>
  );
};
