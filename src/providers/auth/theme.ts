import { darkTheme } from "@rainbow-me/rainbowkit";
import appTheme from "src/theme";

export const theme = darkTheme({
  accentColor: appTheme.colors.primary?.[500],
  accentColorForeground: appTheme.colors.white,
  overlayBlur: "small",
});
