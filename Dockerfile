FROM smartcontract/chainlink:2.1.1

WORKDIR /chainlink

COPY ./.chainlink-node/config.toml config.toml
COPY ./.chainlink-node/secrets.toml secrets.toml