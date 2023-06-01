import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { FiUser, FiLogOut, FiActivity, FiSun, FiMoon } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import { useTranslate } from "src/hooks/use-translate";

export const AuthButton: React.FC<ButtonProps> = (props) => {
  const { disconnect } = useDisconnect();
  const { colorMode, toggleColorMode } = useColorMode();
  const auth = useTranslate("auth");
  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant="outline"
                    {...props}
                  >
                    {auth.connect_wallet}
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="outline" {...props}>
                    {auth.wrong_network}
                  </Button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button onClick={openChainModal} variant="outline" {...props}>
                    {chain.iconUrl ? (
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        width={12}
                        height={12}
                      />
                    ) : (
                      chain.name
                    )}
                  </Button>
                  <Menu>
                    <MenuButton
                      as={Button}
                      aria-label={account.displayName}
                      mr="1"
                      {...props}
                    >
                      {account.displayName}
                    </MenuButton>
                    <MenuList fontSize="sm">
                      <Link href="/app">
                        <MenuItem icon={<FiActivity />}>
                          {auth.dashboard}
                        </MenuItem>
                      </Link>
                      <MenuItem icon={<FiUser />}>{auth.lens_profile}</MenuItem>
                      <MenuItem
                        icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                        onClick={toggleColorMode}
                      >
                        {colorMode === "dark" ? "Light" : "Night"} Mode
                      </MenuItem>
                      <MenuItem
                        icon={<FiLogOut />}
                        onClick={() => disconnect()}
                      >
                        {auth.disconnect_wallet}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
