"use client";
import { useState } from "react";
import { NextPage } from "next";
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  ModalFooter,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DataTable,
  Field,
  FormDialog,
  FormLayout,
  Select,
  SelectButton,
  SelectList,
  SubmitButton,
} from "@saas-ui/react";
import { FiPlusSquare } from "react-icons/fi";

import { BackgroundGradient } from "src/components/gradients/background-gradient";
import { PageTransition } from "src/components/motion/page-transition";
import { Section } from "src/components/section";
import { Feature, Features } from "src/components/features";
import { useSavingsFactoryRead, useSavings } from "src/hooks/common";
import { useGetTokensMeta } from "src/hooks/use-get-token-meta";
import { ContractAddress } from "src/hooks/types";

const App: NextPage = () => {
  const disclosure = useDisclosure();
  const [selectedToken, setSelectedToken] = useState<ContractAddress | null>(
    null
  );
  const { data: tokens } = useSavingsFactoryRead<ContractAddress[]>({
    functionName: "getAllAllowedTokens",
  });
  const { data: userSavingsGoals } = useSavingsFactoryRead<ContractAddress[]>({
    functionName: "getUserSavingsGoals",
  });
  const { data: tokensList } = useGetTokensMeta({ tokens });
  const { data: savingsList } = useSavings(userSavingsGoals, [
    {
      functionName: "goalAmount",
    },
    {
      functionName: "daysToReachGoal",
    },
    {
      functionName: "balanceOf",
    },
    {
      functionName: "goalName",
    },
    {
      functionName: "getRemainingAmount",
    },
  ]);

  const totalBalance = savingsList.reduce((total, saving) => {
    const selectedAddress = selectedToken || tokensList?.[0].address;
    return saving.address === selectedAddress
      ? total + saving.balanceOf.toNumber()
      : total;
  }, 0);

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
                  {new Intl.NumberFormat("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }).format(totalBalance)}
                </Text>
                <Select
                  name="token"
                  defaultValue={tokensList?.[0].address}
                  options={tokensList?.map((token) => ({
                    label: token.symbol,
                    value: token.address,
                  }))}
                  onChange={(value) =>
                    setSelectedToken(value as ContractAddress)
                  }
                >
                  <SelectButton />
                  <SelectList fontSize="sm" />
                </Select>
              </HStack>
            }
          />
          <ButtonGroup>
            <Button variant="outline" size="md" px="6">
              Borrow
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={disclosure.onOpen}
              leftIcon={<FiPlusSquare />}
            >
              New Savings
            </Button>
          </ButtonGroup>
        </HStack>

        <PageTransition width="100%">
          <Features
            features={[
              {
                title: "Saving Goals",
                description: (
                  <Box overflowX="auto">
                    <DataTable
                      columns={[
                        {
                          header: "Name",
                          accessorKey: "goalName",
                        },
                        {
                          header: "Token",
                          accessorKey: "address",
                        },
                        {
                          header: "Target",
                          accessorKey: "goalAmount",
                        },
                        {
                          header: "Timeline",
                          accessorKey: "daysToReachGoal",
                        },
                      ]}
                      data={savingsList}
                      isSelectable
                    />
                  </Box>
                ),
                delay: 0.6,
              },
              {
                title: "Goals Tracker",
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
      <FormDialog
        title=" "
        onSubmit={() => null}
        {...disclosure}
        footer={
          <ModalFooter>
            <SubmitButton>Withdraw</SubmitButton>
          </ModalFooter>
        }
      >
        <FormLayout>
          <Field
            name="amount"
            label="Amount:"
            rules={{ required: "Amount is required" }}
            type="number"
          />
          <Field
            name="address"
            label="Wallet Address:"
            rules={{ required: "Wallet Address is required" }}
          />
        </FormLayout>
      </FormDialog>
    </Section>
  );
};

export default App;
