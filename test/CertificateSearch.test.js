import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchCertificates from '../app/certificates/page';
import fetchMock from 'jest-fetch-mock';


fetchMock.enableMocks();

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('SearchCertificates', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('renders the search form and submits data', async () => {
    fetch.mockResponseOnce(JSON.stringify(['base64EncodedImageString']));

    render(<SearchCertificates />);

    // Check if the form elements are rendered
    expect(screen.getByPlaceholderText('Please enter the certificate hash')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Please enter the certificate hash'), {
      target: { value: 'testHash' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    // Check if loading message is displayed
    expect(screen.getByText('Confirming the certificate, please wait ....')).toBeInTheDocument();

    // Wait for the fetch to complete and check if the image is displayed
    await waitFor(() => {
      expect(screen.getByAltText('Fetched from IPFS')).toBeInTheDocument();
    });

    // Check if the image src is correct
    expect(screen.getByAltText('Fetched from IPFS')).toHaveAttribute('src', 'data:image/png;base64,base64EncodedImageString');
  });

  test('displays an error message on fetch failure', async () => {
    fetch.mockReject(new Error('API is down'));

    render(<SearchCertificates />);

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Please enter the certificate hash'), {
      target: { value: 'testHash' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the fetch to complete and check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});