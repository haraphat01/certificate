"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../../app/styles/SearchPage.module.css';
import Web3 from 'web3';
import { useForm } from 'react-hook-form';

const SearchCertificates = () => {
  const { register, handleSubmit, errors } = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const onSearchSubmit = async (data) => {
    try {
      const response = await fetch('/api/searchCertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results.');
      }

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching certificates:', error);
      alert('An error occurred while searching. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Search Student Certificates</title>
        <meta name="description" content="Search for student certificates on the blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Search for Student Certificates
        </h1>

        <div className={styles.searchFormContainer}>
          <form onSubmit={handleSubmit(onSearchSubmit)} className={styles.searchForm}>
            <div className={styles.formGroup}>
              <label htmlFor="searchTerm">Search Term:</label>
              <input name="searchTerm" id="searchTerm"   input {...register('test', { required: true })} />
              {/* {errors.searchTerm && <span>This field is required</span>} */}
            </div>
            <button type="submit" className={styles.searchButton}>Search</button>
          </form>
        </div>

        {searchResults.length > 0 && (
          <div className={styles.resultsContainer}>
            <h2>Search Results</h2>
            <ul className={styles.resultsList}>
              {searchResults.map((result, index) => (
                <li key={index} className={styles.resultItem}>
                  <p><strong>Name:</strong> {result.name}</p>
                  <p><strong>Student ID:</strong> {result.studentId}</p>
                  <p><strong>Certificate ID:</strong> {result.certificateId}</p>
                  <p><strong>Transaction Hash:</strong> {result.transactionHash}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchCertificates;
