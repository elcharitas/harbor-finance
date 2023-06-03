import { extendTheme } from "@chakra-ui/react";
import { theme } from "@saas-ui/react";
import CONFIG from "src/configs";

import components from "./components";
import { fontSizes } from "./foundations/typography";
import { colors } from "./foundations/colors";

import "@fontsource/lato";

const styles = {
  global: () => ({
    body: {
      color: "gray.900",
      bg: "white",
      fontSize: "lg",
      _dark: {
        color: "white",
        bg: "gray.900",
      },
    },
  }),
};

export default extendTheme(
  {
    config: {
      initialColorMode: CONFIG.APP.INITIAL_COLOR_MODE,
      useSystemColorMode: false,
    },
    styles,
    fontSizes,
    components,
    colors,
  },
  theme
);
