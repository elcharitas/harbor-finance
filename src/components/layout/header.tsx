import { useRef, useSyncExternalStore } from "react";

import {
  Box,
  BoxProps,
  Container,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useScroll } from "framer-motion";

import Navigation from "./navigation";
import { Logo } from "./logo";

export interface HeaderProps extends Omit<BoxProps, "children"> {}

export const Header = (props: HeaderProps) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {};

  const { scrollY } = useScroll();
  const y = useSyncExternalStore(
    (cb) => scrollY.onChange(cb),
    () => scrollY.get(),
    () => 0
  );

  const bg = useColorModeValue("whiteAlpha.700", "blackAlpha.50");

  return (
    <Box
      ref={ref}
      as="header"
      top="0"
      w="full"
      position="fixed"
      zIndex="sticky"
      borderColor="whiteAlpha.100"
      transitionProperty="common"
      transitionDuration="normal"
      bg={y > height ? bg : ""}
      boxShadow={y > height ? "md" : ""}
      {...props}
    >
      <Container maxW="container.2xl" px="8" py="4">
        <Flex width="full" align="center" justify="space-between">
          <Logo />
          <Navigation />
        </Flex>
      </Container>
    </Box>
  );
};
