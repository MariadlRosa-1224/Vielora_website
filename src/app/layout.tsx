import type { Metadata } from "next";
import Header from "@/components/layout/header";
import "./globals.css";
import "@/components/layout/Footer"
import Footer from "@/components/layout/Footer";


const siteUrl =
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Isles of Vielora",
    template: "%s | Isles of Vielora",
  },

  description:
    "Explore the world, stories, characters, creatures and lore of Vielora.",

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Isles of Vielora",
    title: "Isles of Vielora",
    description:
      "Explore the world, stories, characters, creatures and lore of Vielora.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Isles of Vielora",
    description:
      "Explore the world, stories, characters, creatures and lore of Vielora.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
