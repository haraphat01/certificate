"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';
import { useForm } from 'react-hook-form';
import styles from '../styles/CertificateForm.module.css';
import { Form, Input, Upload, Button, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

const CertificateUploadForm = () => {
  const [accounts, setAccounts] = useState([]);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const router = useRouter();

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image file!');
    }
    return isImage;
  };


 const onFinish = async (formData) => { 
 const imagePath = fileList[0].thumbUrl
formData.imagePath = imagePath;
formData.accounts = accounts;

    console.log(formData.accounts)

  // Log the form data
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask to use this feature!');
      
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      setAccounts(await web3.eth.getAccounts());
      if (accounts.length === 0) throw new Error("Can't access any Ethereum accounts!");

      const response = await fetch('/api/uploadCertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Pass formData directly
      });

      if (response.ok) {
        message.success('Certificate uploaded successfully!');
        router.push('/');
      } else {
        message.error('Failed to upload certificate. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      message.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <Form
       form={form}
        name="upload_certificate" // Changed form name to follow convention
        onFinish={onFinish} // Used onFinish instead of onSubmit
        layout="vertical"
        initialValues={{ remember: true }}
        className="w-full sm:w-1/2"
      >
        <Form.Item
          name="name"
          label={<label className="whiteLabel">Student Name</label>}
          rules={[{ required: true, message: 'Please enter student name' }]}
        >
          <Input placeholder="Enter Student Name" />
        </Form.Item>
        <Form.Item
          name="studentId"
          label={<label className="whiteLabel">Student ID</label>}
          rules={[{ required: true, message: 'Please enter student ID' }]}
        >
          <Input placeholder="Student ID" />
        </Form.Item>
        <Form.Item
          name="studentM"
          label={<label className="whiteLabel">Major</label>}
          rules={[{ required: true, message: 'Please enter major' }]}
        >
          <Input placeholder="Major" />
        </Form.Item>
        <Form.Item
          name="studentYear"
          label={<label className="whiteLabel">Graduation Year</label>}
          rules={[{ required: true, message: 'Please enter graduation year' }]}
        >
          <Input placeholder="Graduation Year" />
        </Form.Item>
        <Form.Item>
          <Upload
            name="certificate"
            fileList={fileList}
            onChange={handleUploadChange}
            onRemove={handleRemove}
            beforeUpload={beforeUpload}
            multiple={false} // Changed to allow only one file upload
            listType="picture-card"
            accept="image/*"
            maxFileSize={5 * 1024 * 1024}
          >
            <Button icon={<UploadOutlined />} className="whiteLabel">Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CertificateUploadForm;
