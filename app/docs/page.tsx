"use client";
import { NextPage } from "next";
import { Center } from "@chakra-ui/react";

import { BackgroundGradient } from "src/components/gradients/background-gradient";
import { PageTransition } from "src/components/motion/page-transition";
import { Section } from "src/components/section";
import { Features } from "src/components/features";

const Docs: NextPage = () => {
  return (
    <Section height="calc(100vh - 200px)">
      <BackgroundGradient zIndex="-1" />

      <Center height="100%" pt="20">
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
            columns={2}
            featureProps={{
              borderRadius: "md",
              borderColor: "whiteAlpha.200",
              borderWidth: "1px",
              p: "8",
              _hover: {
                boxShadow: "xl",
              },
            }}
          />
        </PageTransition>
      </Center>
    </Section>
  );
};

export default Docs;
