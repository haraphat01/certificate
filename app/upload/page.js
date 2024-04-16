"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';
import { useForm } from 'react-hook-form';
import styles from '../styles/CertificateForm.module.css';

const CertificateUploadForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const [file, setFile] = useState(null);
  const router = useRouter();

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (!window.ethereum) alert('Please install MetaMask to use this feature!');
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) throw new Error("Can't access any Ethereum accounts!");
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('studentId', data.studentId);
      formData.append('studentM', data.studentM);
      formData.append('studentYear', data.studentYear);
      formData.append('certificate', file);

      const response = await fetch('/api/uploadCertificate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Certificate uploaded successfully!');
        router.push('/');
      } else {
        alert('Failed to upload certificate. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.uploadForm}>
        <h2>Upload Student Certificate</h2>
        <div className={styles.formGroup}>
          <label htmlFor="name">Student Name:</label>
          <input name="name" id="name" input {...register('name', { required: true })} />
          {/* {errors.name && <span>This field is required</span>} */}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="studentId">Student ID:</label>
          <input name="studentId" id="studentId" input {...register('studentId', { required: true })} />
          {/* {errors.studentId && <span>This field is required</span>} */}
        </div>
        <div className={styles.formrGroup}>
          <label htmlFor="studentId">Major:</label>
          <input name="studentM" id="studentM" input {...register('studentM', { required: true })} />
          {/* {errors.studentId && <span>This field is required</span>} */}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="studentId">Graduation Year:</label>
          <input name="studentYear" id="studentYear" input {...register('studentYear', { required: true })} />
          {/* {errors.studentId && <span>This field is required</span>} */}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="certificate">Certificate File:</label>
          <input type="file" name="certificate" id="certificate" onChange={onFileChange} />
          {/* {errors.certificate && <span>This field is required</span>} */}
        </div>
        <button type="submit" className={styles.submitButton}>Upload Certificate</button>
      </form>
    </div>
  );
};
export default CertificateUploadForm;
