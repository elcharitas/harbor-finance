import * as React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { NavLink } from "src/components/nav-link";

export interface LogoProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Logo: React.FC<LogoProps> = ({ href = "/", onClick }) => {
  return (
    <Flex h="8" flexShrink="0" alignItems="flex-start">
      <NavLink
        p="1"
        display="flex"
        href={href}
        borderRadius="sm"
        onClick={onClick}
      >
        <Text as="h3" fontWeight="bold">
          Harbour Finance
        </Text>
      </NavLink>
    </Flex>
  );
};
