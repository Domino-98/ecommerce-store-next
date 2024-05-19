import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecommerce Store Next",
  description:
    "Ecommerce Store Next is an example ecommerce store built with Next.js.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        {children}
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
