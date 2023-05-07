"use client";
import type { NextPage } from "next";
import { Inter } from "next/font/google";
import {
  Container,
  Box,
  Stack,
  ButtonGroup,
  Button,
  Icon,
  Text,
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

const font = Inter({ subsets: ["latin"], weight: "800" });

const Home: NextPage = () => {
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
                Your Investments can
                <Br />
                <Text
                  mt="4"
                  textTransform="uppercase"
                  className={font.className}
                >
                  Make a Difference
                </Text>
              </FallInPlace>
            }
            description={
              <FallInPlace
                delay={0.4}
                fontWeight="medium"
                textAlign="center"
                width="100%"
              >
                Harbour Finance is decentralised finance (DeFi) protocol that
                allows users to earn interest on their crypto assets.
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
                    button: {
                      marginInlineStart: "0 !important",
                    },
                  },
                }}
              >
                <Button size="lg" variant="outline">
                  Connect Wallet
                </Button>
                <Button
                  size="lg"
                  variant="primary"
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
                  Watch a Demo
                </Button>
              </ButtonGroup>
            </FallInPlace>
          </Hero>
        </Stack>
      </Container>

      <Features
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: "Decentralized Investments",
            icon: FiGlobe,
            description:
              "Harbour Finance is a blockchain-based protocol, fostering transparent, secure, and unrestricted green investments.",
            iconPosition: "left",
            delay: 0.6,
          },
          {
            title: "Diversified Portfolios",
            icon: FiPieChart,
            description:
              "Harbour Finance offers unique investment opportunities across various asset classes in crypto.",
            iconPosition: "left",
            delay: 0.8,
          },
          {
            title: "Real-Time Growth Data",
            icon: FiClock,
            description:
              "Through our seamless integration with Chainlink, we provide real-time growth data directly on your dashboard.",
            iconPosition: "left",
            delay: 1,
          },
          {
            title: "Community-Driven Philosophy",
            icon: FiThumbsUp,
            description:
              "As a community-driven platform, Harbour Finance ensures every user has a voice in shaping the future of DeFi.",
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
