import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@chakra-ui/react";

export const AuthButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
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
                  <Button onClick={openConnectModal} variant="outline">
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="outline">
                    Wrong network
                  </Button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button onClick={openChainModal} variant="outline">
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
                  <Button onClick={openAccountModal} mr="1">
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
