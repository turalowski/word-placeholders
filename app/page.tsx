'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Importing necessary modules
import React, { useState, ChangeEvent, FormEvent } from 'react';

// Functional component for Home
export default function Home(): JSX.Element {
  // State to hold the selected file
  const [file, setFile] = useState<File | null>(null);
  const [keys, setKeys] = useState<
    [
      {
        raw: string;
        type: string;
        code: string;
      },
    ]
  >([]);
  const [values, setValues] = useState({});

  // Function to handle file input change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check if a file is selected
    if (!file) {
      console.error('No file selected');
      return;
    }
    // Create a new form data object
    const formData = new FormData();
    formData.append('file', file);
    try {
      // Send a POST request with the file data
      const response = await fetch('/api/keys', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        // If request is successful, create a blob from the response
        const { keys } = await response.json();
        setKeys(keys);
      } else {
        console.error(
          'Error uploading file and parsing placeholders:',
          response.statusText
        );
        // Handle error response
      }
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
      // Handle fetch error
    }
  };

  // Function to handle form submission
  const handleSubmitReplace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check if a file is selected
    if (!file) {
      console.error('No file selected');
      return;
    }
    // Create a new form data object
    const formData = new FormData();
    console.log('values', values);
    formData.append('values', JSON.stringify(values));
    formData.append('file', file);
    try {
      // Send a POST request with the file data
      const response = await fetch('/api/placeholder', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        // If request is successful, create a blob from the response
        const blob = await response.blob();
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));
        // Create a link element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        // Append the link to the body
        document.body.appendChild(link);
        // Trigger download
        link.click();
        // Cleanup: remove the link from the DOM
        link.parentNode?.removeChild(link);
        // Handle success response
      } else {
        console.error('Error uploading file:', response.statusText);
        // Handle error response
      }
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
      // Handle fetch error
    }
  };

  // Render the component
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-6 border-black border p-12">
        <h1>Upload file with placeholders (text in curly brackets)</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-3">
            <Input name="file" type="file" onChange={handleFileChange} />
            <Button type="submit" disabled={!file}>
              Upload
            </Button>
          </div>
        </form>
        {keys.length > 0 && (
          <form onSubmit={handleSubmitReplace}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h1>Enter values for placeholders</h1>
                {keys.map(key => (
                  <div key={key.code} className="flex justify-between">
                    <Input
                      placeholder={key.code}
                      value={values[key.code] || ''}
                      onChange={event => {
                        setValues(prevValues => ({
                          ...prevValues,
                          [key.code]: event.target.value,
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
              <Button className="w-full" type="submit">
                Download
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
