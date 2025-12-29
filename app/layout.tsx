import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import fonts
import AuthProvider from "./components/AuthProvider";
import "./globals.css";

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vrunda Mehndi Portfolio",
  description: "Exquisite Mehndi designs for weddings and special occasions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
