"use client";
import { NextPage } from "next";
import { Button, ButtonGroup, HStack, Stack, Text } from "@chakra-ui/react";
import { Select, SelectButton, SelectList } from "@saas-ui/react";

import { BackgroundGradient } from "src/components/gradients/background-gradient";
import { PageTransition } from "src/components/motion/page-transition";
import { Section } from "src/components/section";
import { Feature, Features } from "src/components/features";

const App: NextPage = () => {
  return (
    <Section height="calc(100vh - 200px)" p="0">
      <BackgroundGradient zIndex="-1" />

      <Stack height="100%" pt="20">
        <HStack
          alignItems="center"
          justifyContent="space-between"
          px="12"
          mt="24"
        >
          <Feature
            title="Earnings"
            description={
              <HStack>
                <Text
                  as="span"
                  fontSize="2xl"
                  fontWeight="bolder"
                  cursor="pointer"
                >
                  0.00
                </Text>
                <Select
                  name="country"
                  defaultValue="nl"
                  options={[
                    { label: "USDC", value: "nl" },
                    { label: "BUSD", value: "us" },
                  ]}
                >
                  <SelectButton />
                  <SelectList fontSize="sm" />
                </Select>
              </HStack>
            }
          />
          <ButtonGroup>
            <Button variant="outline" size="md" px="8">
              Borrow
            </Button>
          </ButtonGroup>
        </HStack>

        <PageTransition width="100%">
          <Features
            features={[
              {
                title: "Investments",
                description: "",
                delay: 0.6,
              },
              {
                title: "Wallet Balance",
                description: "",
                delay: 0.8,
              },
            ]}
            columns={[1, 2]}
            featureProps={{
              borderRadius: "md",
              borderColor: "whiteAlpha.200",
              borderWidth: "1px",
              p: "8",
              _hover: {
                boxShadow: "xl",
              },
            }}
            pt="4"
            px="0"
            mx="0"
          />
        </PageTransition>
      </Stack>
    </Section>
  );
};

export default App;
