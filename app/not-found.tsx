"use client";
import { NextPage } from "next";
import { Center } from "@chakra-ui/react";

import { BackgroundGradient } from "src/components/gradients/background-gradient";
import { PageTransition } from "src/components/motion/page-transition";
import { Section } from "src/components/section";
import { Feature } from "src/components/features";

const NotFound: NextPage = () => {
  return (
    <Section height="calc(100vh - 200px)">
      <BackgroundGradient zIndex="-1" />

      <Center height="100%" pt="20">
        <PageTransition width="100%">
          <Feature
            title="404 - Not Found"
            description="That's weird but we couldn't find this page 🤔"
          />
        </PageTransition>
      </Center>
    </Section>
  );
};

export default NotFound;
