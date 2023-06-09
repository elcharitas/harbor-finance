"use client";
import { useState } from "react";
import { NextPage } from "next";
import { useAccount, useConnect } from "wagmi";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart,
} from "chart.js";
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  ModalFooter,
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
  useSnackbar,
} from "@saas-ui/react";
import { FiPlusSquare } from "react-icons/fi";

import { BackgroundGradient } from "src/components/gradients/background-gradient";
import { PageTransition } from "src/components/motion/page-transition";
import { Section } from "src/components/section";
import { Feature, Features } from "src/components/features";
import {
  useSavings,
  useSavingsFactoryRead,
  useSavingsFactoryWrite,
} from "src/hooks/common";
import { useGetTokensMeta } from "src/hooks/use-get-token-meta";
import { ContractAddress } from "src/hooks/types";
import { useFetch } from "usehooks-ts";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

const App: NextPage = () => {
  const disclosure = useDisclosure();
  const snackbar = useSnackbar();
  const { isConnected } = useAccount({
    onConnect() {
      snackbar.info({ description: "Wallet connected successfully" });
    },
  });
  const { connect } = useConnect();
  const [selectedToken, setSelectedToken] = useState<{
    symbol: string;
    address: ContractAddress;
  } | null>(null);
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
      functionName: "balance",
    },
    {
      functionName: "goalName",
    },
    {
      functionName: "remainingAmount",
    },
  ]);
  const { data: chainlinkPriceFeeds } = useFetch<Record<string, number[]>>(
    `/api/aggregator?days=7&contract=${
      tokensList?.find(({ address }) => address === selectedToken?.address)
        ?.symbol || "Dai"
    }`
  );
  const { writeAsync } = useSavingsFactoryWrite({
    functionName: "createSavingsGoal",
  });

  const currentToken = selectedToken || tokensList?.[0];

  const totalBalance = savingsList?.reduce((total, saving) => {
    const { address } = currentToken ?? {};
    return saving.address === address
      ? total + saving.balance.toNumber()
      : total;
  }, 0);

  const handleSubmit = async ({
    goalAmount,
    daysToReachGoal,
    goalName,
    goalDescription,
  }: Record<string, string>) => {
    if (!isConnected) {
      snackbar.info({ description: "Attempting optimistic connection" });
      connect();
    }
    if (!currentToken?.address) {
      snackbar.error({ description: "Please select a token" });
      return;
    }
    try {
      await writeAsync({
        args: [
          currentToken.address,
          goalAmount,
          daysToReachGoal,
          goalName,
          goalDescription,
        ],
      });
      snackbar.success({
        description: `You're ${daysToReachGoal} days from achieving your goal 😍`,
      });
    } catch (e) {
      snackbar.error({ description: "This is weird but an error occurred 😭" });
    }
  };

  return (
    <Section p="0">
      <BackgroundGradient zIndex="-1" />

      <Box pt="20">
        <HStack
          gap="4"
          alignItems={{ base: "flex-end", md: "center" }}
          justifyContent="space-between"
          px={{ base: "4", md: "12" }}
          mt={{ base: "8", md: "24" }}
        >
          <Feature
            title="Saving Balance"
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
                  }).format(totalBalance ?? 0)}
                </Text>
                <Select
                  name="token"
                  defaultValue={tokensList?.[0].address}
                  options={tokensList?.map((token) => ({
                    label: token.symbol,
                    value: token.address,
                  }))}
                  onChange={(value) =>
                    setSelectedToken({
                      symbol:
                        tokensList?.find(
                          ({ address }) =>
                            address === (value as ContractAddress)
                        )?.symbol ?? "",
                      address: value as ContractAddress,
                    })
                  }
                >
                  <SelectButton />
                  <SelectList fontSize="sm" />
                </Select>
              </HStack>
            }
          />
          <ButtonGroup>
            <Button
              title="Coming soon"
              variant="outline"
              size="md"
              px="6"
              display={{ base: "none", md: "block" }}
              isDisabled
            >
              Loan
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={disclosure.onOpen}
              leftIcon={<FiPlusSquare />}
              isDisabled={!isConnected}
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
                  <Box pt={4} overflowX="scroll">
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
                      data={savingsList ?? []}
                    />
                  </Box>
                ),
                delay: 0.6,
              },
              {
                title: "Growth Tracker",
                description: (
                  <Box pt={4}>
                    <Line
                      height={350}
                      data={{
                        labels: Object.keys(chainlinkPriceFeeds ?? {}),
                        datasets: [
                          {
                            label: "My First dataset",
                            fill: false,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: "butt",
                            borderDash: [],
                            data: Object.values(chainlinkPriceFeeds ?? {}),
                          },
                        ],
                      }}
                    />
                  </Box>
                ),
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
      </Box>
      <FormDialog
        title=" "
        onSubmit={handleSubmit}
        {...disclosure}
        footer={
          <ModalFooter>
            <SubmitButton>Create Goal</SubmitButton>
          </ModalFooter>
        }
      >
        <FormLayout>
          <Field
            name="goalName"
            label="Goal Title:"
            rules={{
              required: "Writing what you're saving for helps keep track.",
            }}
          />
          <Field
            name="goalDescription"
            label="Describe your goal:"
            rules={{
              required:
                "Try describing in one or two words what this goal is to you.",
            }}
          />
          <Field
            name="goalAmount"
            label="Amount:"
            rules={{ required: "The amount to save is required" }}
            type="number"
          />
          <Field
            name="daysToReachGoal"
            label="How many days should we save for:"
            rules={{ required: "Amount is required" }}
            type="number"
          />
        </FormLayout>
      </FormDialog>
    </Section>
  );
};

export default App;
