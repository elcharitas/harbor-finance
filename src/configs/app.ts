const APP_CONFIG = {
  NAME: "Harbor Finance",
  DESCRIPTION: "Harbor Finance",
  NETWORK_ID: process.env.NEXT_PUBLIC_NETWORK_ID,
  IS_DEV: process.env.NODE_ENV === "development",
  INITIAL_COLOR_MODE: "dark",
};

export default APP_CONFIG;
