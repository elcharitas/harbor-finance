"use client";
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { Inter } from "next/font/google";
import {
  Container,
  Box,
  Stack,
  ButtonGroup,
  Button,
  Icon,
} from "@chakra-ui/react";

import { FallInPlace } from "src/components/motion/fall-in-place";
import { Hero } from "src/components/hero";
import { Br } from "@saas-ui/react";
import {
  FiArrowRight,
  FiThumbsUp,
  FiPieChart,
  FiGlobe,
  FiClock,
} from "react-icons/fi";
import { Features } from "src/components/features";
import { BackgroundGradient } from "src/components/gradients/background-gradient";
import { MotionBox } from "src/components/motion/box";
import { NavLink } from "src/components/nav-link";
import { useTranslate } from "src/hooks/use-translate";

const font = Inter({ subsets: ["latin"], weight: "800" });

const flipTransition = {
  duration: 1,
  repeat: Infinity,
  ease: "easeOut",
};

const HERO_TAGLINES = ["text_primary", "text_secondary", "text_tertiary"];

const Home: NextPage = () => {
  const [tick, setTick] = useState(0);
  const hero = useTranslate("hero");
  const features = useTranslate("features");
  const common = useTranslate("common");

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((current) => (current + 1) % 3);
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height="100%" />
      <Container maxW="container.xl" pt="40" pb="8">
        <Stack
          direction={{ base: "column", lg: "row" }}
          alignItems="center"
          justifyContent="center"
        >
          <Hero
            id="home"
            justifyContent="center"
            width="100%"
            px="0"
            title={
              <FallInPlace textAlign="center">
                {hero.title}
                <Br />
                <MotionBox
                  mt="4"
                  textTransform="uppercase"
                  className={font.className}
                  style={{ originY: 0.5 }}
                  transition={flipTransition}
                  animate={{
                    scale: [1, 1.4, 1],
                    rotateX: [0, 0, 180],
                  }}
                >
                  {hero[HERO_TAGLINES[tick]]}
                </MotionBox>
              </FallInPlace>
            }
            description={
              <FallInPlace
                delay={0.4}
                fontWeight="medium"
                textAlign="center"
                width="100%"
              >
                {hero.description}
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <ButtonGroup
                spacing={4}
                alignItems="center"
                justifyContent="center"
                width="100%"
                mt="8"
                sx={{
                  "@media (max-width: 768px)": {
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: "4",
                    a: {
                      marginInlineStart: "0 !important",
                    },
                  },
                }}
              >
                <Button size="lg" variant="outline">
                  {common.watch_demo}
                </Button>
                <NavLink
                  size="lg"
                  variant="primary"
                  href="/app"
                  rightIcon={
                    <Icon
                      as={FiArrowRight}
                      sx={{
                        transitionProperty: "common",
                        transitionDuration: "normal",
                        ".chakra-button:hover &": {
                          transform: "translate(5px)",
                        },
                      }}
                    />
                  }
                >
                  {common.launch_app}
                </NavLink>
              </ButtonGroup>
            </FallInPlace>
          </Hero>
        </Stack>
      </Container>

      <Features
        id="features"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: features.primary_title,
            icon: FiGlobe,
            description: features.primary_description,
            iconPosition: "left",
            delay: 0.6,
          },
          {
            title: features.secondary_title,
            icon: FiPieChart,
            description: features.secondary_description,
            iconPosition: "left",
            delay: 0.8,
          },
          {
            title: features.tertiary_title,
            icon: FiClock,
            description: features.tertiary_description,
            iconPosition: "left",
            delay: 1,
          },
          {
            title: features.quaternary_title,
            icon: FiThumbsUp,
            description: features.quaternary_description,
            iconPosition: "left",
            delay: 1.1,
          },
        ]}
        reveal={FallInPlace}
      />
    </Box>
  );
};

export default Home;
