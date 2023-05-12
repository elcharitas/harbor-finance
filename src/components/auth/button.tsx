import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { FiUser, FiLogOut, FiActivity, FiSun, FiMoon } from "react-icons/fi";
import Link from "next/link";
import {
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";

export const AuthButton: React.FC<ButtonProps> = (props) => {
  const { disconnect } = useDisconnect();
  const { colorMode, toggleColorMode } = useColorMode();
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
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="outline" {...props}>
                    Wrong network
                  </Button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button onClick={openChainModal} variant="outline" {...props}>
                    {chain.iconUrl ? (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        style={{ width: 12, height: 12 }}
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
                        <MenuItem icon={<FiActivity />}>Dashboard</MenuItem>
                      </Link>
                      <MenuItem icon={<FiUser />}>
                        Connect Lens Profile
                      </MenuItem>
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
                        Log out
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
