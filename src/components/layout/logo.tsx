import * as React from "react";
import { Flex, Heading, VisuallyHidden } from "@chakra-ui/react";
import { Link } from "@saas-ui/react";

export interface LogoProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Logo = ({ href = "/", onClick }: LogoProps) => {
  const logo = (
    <Heading as="h1" size="md">
      Harbour
    </Heading>
  );

  return (
    <Flex h="8" flexShrink="0" alignItems="flex-start">
      <Link
        href={href}
        display="flex"
        p="1"
        borderRadius="sm"
        onClick={onClick}
      >
        {logo}
        <VisuallyHidden>Harbour</VisuallyHidden>
      </Link>
    </Flex>
  );
};
