
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBars from "../components/navBar"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Certificate Management App",
  description: "Decetralized Certificate Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBars /> {/* Add the NavBar component here */}
        {children}
        
        
      </body>
    </html>
  );
}
