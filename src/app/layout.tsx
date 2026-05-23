import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { WalletProvider } from "@/providers/wallet-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Praxon · Sponsor real physical work on Konnex",
  description:
    "Praxon is a community-funded marketplace for real Konnex subnet tasks. Sponsors pool testKNX, miners execute, validators score, Proof-of-Physical-Work certifies.",
  metadataBase: new URL("https://praxon.app"),
  openGraph: {
    title: "Praxon — Sponsor real physical work",
    description:
      "Pool testKNX, settle on PoPW, earn reputation. Built on the Konnex network.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <WalletProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
