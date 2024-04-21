"use client"
import { MetaMaskProvider } from "metamask-react";
import Homepage from "./home/index"
export default function Home() {
  return (
    <MetaMaskProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">

        <Homepage />

      </main>
    </MetaMaskProvider>
  );
}
