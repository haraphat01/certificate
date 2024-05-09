"use client"
import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import { useMetaMask } from "metamask-react";
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Homepage() {
    const { status, connect, account } = useMetaMask();

    useEffect(() => {
        if (status === "unavailable") alert("MetaMask is not installed!");
    }, [status]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Student Certificate Blockchain Platform</title>
                <meta name="description" content="A platform for managing student certificates on the blockchain" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                     Student Certificate Blockchain Platform
                </h1>

                <p className={styles.description}>
                    Connect your MetaMask wallet to get started
                </p>

                {status === "notConnected" && (
                    <button className={styles.button} onClick={connect}>Connect MetaMask</button>
                )}

                {status === "connected" && (
                    <div>
                        <p>Wallet connected: {account}</p>
                        <div className={styles.grid}>
                            <button className={styles.card}>
                                <Link href="/certificates">

                                    <h2>Search Certificates &rarr;</h2>
                                    <p>Find and verify student certificates.</p>

                                </Link>
                            </button>
                            <button className={styles.card}>
                                <Link href="/upload">

                                    <h2>Upload Certificate &rarr;</h2>
                                    <p>Upload a new student certificate to the blockchain.</p>

                                </Link>
                            </button>

                        </div>
                    </div>
                )}
            </main>

            <footer className={styles.footer}>
                Powered by <a href="https://ethereum.org">Ethereum</a>
            </footer>
        </div>
    );
}