import { darkTheme } from "@rainbow-me/rainbowkit";
import appTheme from "src/theme";

export const theme = {
  ...darkTheme({
    accentColor: appTheme.colors.primary?.[600],
    accentColorForeground: appTheme.colors.white,
    overlayBlur: "small",
    borderRadius: "small",
  }),
  fonts: {
    body: "Lato, sans-serif",
  },
};
