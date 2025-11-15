import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import clsx from "clsx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Midnight Velvet | A Jazzy Song Generator",
  description:
    "Compose a smoky jazz tune with lush chords, silky melodies, and evocative lyrics powered by the web."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.variable,
          playfair.variable,
          "min-h-screen bg-midnight-950 text-white antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
