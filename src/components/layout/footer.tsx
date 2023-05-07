import {
  Box,
  BoxProps,
  SimpleGrid,
  Container,
  Text,
  Stack,
  HStack,
} from "@chakra-ui/react";

import { NavLink } from "src/components/nav-link";

export interface FooterProps extends BoxProps {
  columns?: number;
}

const NAV_LINKS = [
  {
    label: "Launch App",
    href: "/app",
    variant: "ghost",
  },
  {
    id: "governance",
    label: "Governance",
    variant: "ghost",
  },
  {
    id: "features",
    label: "Features",
    variant: "ghost",
  },
];

export const Footer: React.FC<FooterProps> = ({ columns = 2, ...rest }) => {
  return (
    <Box bg="white" _dark={{ bg: "gray.900" }} {...rest}>
      <Container maxW="container.2xl" px="8" py="8">
        <SimpleGrid columns={columns}>
          <Stack spacing="8">
            <Copyright title="Harbour Finance" />
          </Stack>
          <HStack justify="flex-end" spacing="4" alignSelf="flex-end">
            {NAV_LINKS.map(({ href, id, ...props }) => (
              <NavLink
                href={href || `/#${id}`}
                key={href || `/#${id}`}
                {...props}
              >
                {props.label}
              </NavLink>
            ))}
          </HStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export interface CopyrightProps {
  title: React.ReactNode;
}

export const Copyright: React.FC<CopyrightProps> = ({ title }) => {
  return (
    <Text color="muted" fontSize="sm">
      &copy; {`${new Date().getFullYear()} - ${title}.`}
    </Text>
  );
};
