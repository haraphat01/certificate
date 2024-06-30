import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CertificateUploadForm from '../app/upload/page';
import '@testing-library/jest-dom';

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

test('shows error messages when required fields are empty', async () => {
  render(<CertificateUploadForm />);
  
  fireEvent.click(screen.getByText(/Submit/i));
  
  await waitFor(() => {
    expect(screen.queryByText(/Please enter student name/i)).toBeInTheDocument();
    expect(screen.queryByText(/Please enter student ID/i)).toBeInTheDocument();
    expect(screen.queryByText(/Please enter major/i)).toBeInTheDocument();
    expect(screen.queryByText(/Please enter graduation year/i)).toBeInTheDocument();
  });
});