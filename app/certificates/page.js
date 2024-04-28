"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../../app/styles/SearchPage.module.css';
import Web3 from 'web3';
import { useForm } from 'react-hook-form';
import { Form, Input, Upload, Button, Select, message, Alert } from 'antd';


const SearchCertificates = () => {
  const [form] = Form.useForm();
  const { register, handleSubmit, errors } = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);


  const onSearchSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/api/searchCertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        let result = await response.json();

        setSearchResults(result);
      } else {
        console.error('Failed to send data:', response.statusText);
      }
    } catch (error) {
      Alert('Error:', error);
    } finally {
      setLoading(false);
      form.resetFields()
    }
  };


  // Assuming the base64 string is in the 'image' field
  console.log("data from backend", searchResults)

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
          <Form form={form}
            name="upload_certificate" // Changed form name to follow convention
            onFinish={onSearchSubmit} // Used onFinish instead of onSubmit
            layout="vertical"
            initialValues={{ remember: true }}
            className="w-full sm:w-1/2" >
            <Form.Item
              name="hash"
              label={<label className="whiteLabel">Student Name</label>}
              rules={[{ required: true, message: 'Please enter student hash code' }]}
            >
              <Input placeholder="Enter Student Name" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>


        </div>
        <div className={styles.container}>
          {/* ... */}
          {loading ? (
            <p>Confirming the certificate, please wait ....</p>
          ) : searchResults ? (
            <Image src={`data:image/png;base64,${searchResults}`} alt="Fetched from IPFS" width={500} height={500}
            />
          ) : null}
          {/* ... */}
        </div>




      </main>
    </div>
  );
};

export default SearchCertificates;
