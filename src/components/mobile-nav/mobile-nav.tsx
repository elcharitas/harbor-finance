import {
  Box,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  IconButtonProps,
  LinkProps,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useUpdateEffect,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Logo } from "src/components/layout/logo";
import { Link } from "@saas-ui/react";

interface NavLinkProps extends LinkProps {
  label: string;
  href?: string;
  isActive?: boolean;
}

function NavLink({ href, children, isActive, ...rest }: NavLinkProps) {
  const bgActiveHoverColor = useColorModeValue("gray.100", "whiteAlpha.100");

  return (
    <Link
      href={href}
      display="inline-flex"
      flex="1"
      minH="40px"
      px="8"
      py="3"
      transition="0.2s all"
      fontWeight={isActive ? "semibold" : "medium"}
      borderColor={isActive ? "purple.400" : undefined}
      borderBottomWidth="1px"
      color={isActive ? "white" : undefined}
      _hover={{
        bg: isActive ? "purple.500" : bgActiveHoverColor,
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

interface MobileNavContentProps {
  isOpen?: boolean;
  onClose?: () => void;
  links: Array<Record<string, string | undefined>>;
}

export function MobileNavContent(props: MobileNavContentProps) {
  const { isOpen, onClose = () => {}, links } = props;
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const bgColor = useColorModeValue("whiteAlpha.900", "blackAlpha.50");

  const showOnBreakpoint = useBreakpointValue({ base: true, lg: false });

  React.useEffect(() => {
    if (showOnBreakpoint == false) {
      onClose();
    }
  }, [showOnBreakpoint, onClose]);

  if (isOpen) {
    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          transition={{ duration: 0.08 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Flex
            direction="column"
            w="100%"
            bg={bgColor}
            h="100vh"
            overflow="auto"
            pos="absolute"
            top="0"
            left="0"
            zIndex="modal"
            pb="8"
            backdropFilter="blur(5px)"
          >
            <Box>
              <Flex justify="space-between" px="8" pt="4" pb="4">
                <Logo />
                <HStack spacing="5">
                  <CloseButton ref={closeBtnRef} onClick={onClose} />
                </HStack>
              </Flex>
              <Stack alignItems="stretch" spacing="0">
                {links.map(({ href, id, label }, i) => {
                  return (
                    <NavLink
                      key={href || `/#${id}`}
                      href={href || `/#${id}`}
                      label={label || ""}
                    >
                      {label}
                    </NavLink>
                  );
                })}
              </Stack>
            </Box>
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const MobileNavButton = React.forwardRef(
  (props: IconButtonProps, ref: React.Ref<any>) => {
    return (
      <IconButton
        ref={ref}
        display={{ base: "flex", md: "none" }}
        fontSize="20px"
        color={useColorModeValue("gray.800", "inherit")}
        variant="ghost"
        icon={<AiOutlineMenu />}
        {...props}
        aria-label="Open menu"
      />
    );
  }
);

MobileNavButton.displayName = "MobileNavButton";
