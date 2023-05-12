import * as React from "react";
import { HStack } from "@chakra-ui/react";

import { NavLink } from "src/components/nav-link";

import { useScrollSpy } from "src/hooks/use-scrollspy";

import { MobileNavButton } from "src/components/mobile-nav";
import { MobileNavContent } from "src/components/mobile-nav";
import { useDisclosure } from "@chakra-ui/react";

import ThemeToggle from "./theme-toggle";
import { AuthButton } from "../auth";

const NAV_LINKS = [
  {
    id: "governance",
    label: "Governance",
  },
  {
    label: "Github",
    href: "https://github.com/",
    title: "View the Source code",
  },
  {
    label: "YouTube Demo",
    href: "https://youtube.com/",
    title: "Watch Harbor in action",
  },
  {
    id: "features",
    label: "Features",
  },
  {
    id: "auth",
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
        if (id == "auth") {
          return <AuthButton key={id} display={["none", null, "block"]} />;
        }
        return (
          <NavLink
            display={["none", null, "block"]}
            href={href || `/#${id}`}
            key={href || `/#${id}`}
            isActive={!!(id && activeId === id)}
            target={href?.includes("https") ? "_blank" : undefined}
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
