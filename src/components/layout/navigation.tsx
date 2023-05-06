import * as React from "react";
import { HStack } from "@chakra-ui/react";

import { NavLink } from "src/components/nav-link";

import { useScrollSpy } from "src/hooks/use-scrollspy";

import { MobileNavButton } from "src/components/mobile-nav";
import { MobileNavContent } from "src/components/mobile-nav";
import { useDisclosure } from "@chakra-ui/react";

import ThemeToggle from "./theme-toggle";

const NAV_LINKS = [
  {
    id: "governance",
    label: "Governance",
  },
  {
    id: "features",
    label: "Features",
  },
  {
    label: "Connect Wallet",
    href: "#",
    variant: "outline",
  },
];

const Navigation: React.FC = () => {
  const mobileNav = useDisclosure();
  const activeId = useScrollSpy(
    NAV_LINKS.filter(({ id }) => id).map(({ id }) => `[id="${id}"]`),
    {
      threshold: 0.75,
    }
  );

  const mobileNavBtnRef = React.useRef<HTMLButtonElement>();

  if (mobileNav.isOpen) {
    mobileNavBtnRef.current?.focus();
  }

  return (
    <HStack spacing="2" flexShrink={0}>
      {NAV_LINKS.map(({ href, id, ...props }, i) => {
        return (
          <NavLink
            display={["none", null, "block"]}
            href={href || `/#${id}`}
            key={href || `/#${id}`}
            isActive={!!(id && activeId === id)}
            {...props}
          >
            {props.label}
          </NavLink>
        );
      })}

      <ThemeToggle />

      <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={mobileNav.onOpen}
      />

      <MobileNavContent
        links={NAV_LINKS}
        isOpen={mobileNav.isOpen}
        onClose={mobileNav.onClose}
      />
    </HStack>
  );
};

export default Navigation;
