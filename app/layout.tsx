import { Lato } from "next/font/google";
import { Layout } from "src/components/layout";
import AppProvider from "src/providers/app/provider";

const font = Lato({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Harbour Finance",
  description: "Earn interest on your crypto assets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={font.className}>
        <AppProvider>
          <Layout headerProps={{}} footerProps={{}}>
            {children}
          </Layout>
        </AppProvider>
      </body>
    </html>
  );
}
