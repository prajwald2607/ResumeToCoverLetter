"use client"
import React, { useState } from 'react';

export default function Home() {
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [extractedContent, setExtractedContent] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('output_format', 'text');

      try {
        const response = await fetch('https://api.worqhat.com/api/ai/v2/pdf-extract', {
          method: 'POST',
          headers: {
            'x-api-key': 'U2FsdGVkX187FPQxzgbmIVjXh3O1+xyor30KWVrIBMuFEqGv8NfzXPjE53e3Ju+T',
            'x-org-key': 'U2FsdGVkX19lq3bhhF5TRouMiyL2HvEBD2V5j5nNl6dNL9JWPbsXW0rqlzssW8GieFki6oRVDKTb/z01Hc7m+Q==',
          },
          body: formData,
        });

        const data = await response.json();
        console.log(data);

        // Check if the content property exists in the API response
        if (data.content) {
          const extractedContent = data.content;
          setExtractedContent(extractedContent);
        } else {
          console.error('Error extracting content: Unexpected API response format');
        }
      } catch (error) {
        console.error('Error extracting content:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const generateCoverLetter = async () => {
    setIsLoading(true);
    try {
      const question = 'Generated a cover letter for the given extracted content';
      const fullQuestion = `${extractedContent}\n\n${question}`;
      const requestData = {
        question: fullQuestion,
        randomness: 0.4, // You can adjust the randomness factor as needed
      };

      const response = await fetch('https://api.worqhat.com/api/ai/content/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'U2FsdGVkX187FPQxzgbmIVjXh3O1+xyor30KWVrIBMuFEqGv8NfzXPjE53e3Ju+T',
          'x-org-key': 'U2FsdGVkX19lq3bhhF5TRouMiyL2HvEBD2V5j5nNl6dNL9JWPbsXW0rqlzssW8GieFki6oRVDKTb/z01Hc7m+Q==',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // Optional: Log the API response data

      // Check if the content property exists in the API response
      if (data.content) {
        const generatedCoverLetter = data.content;
        setCoverLetter(generatedCoverLetter);
      } else {
        console.error('Error generating cover letter: Unexpected API response format');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-full items-center justify-center p-5">
      <div className="container h-4/5 my-1 bg-white rounded-md text-white p-10">
        <h1 className="my-3 font-sans text-center text-4xl font-bold p-3 drop-shadow-lg bg-red-600">
          Resume to cover letter
        </h1>

        <div className="text-center container rounded-md text-white my-4 p-5 flex flex-col items-center justify-center">
          <div className="upload flex flex-col items-center">
            <div>
              <label
                htmlFor="upload-button"
                className="btn bg-blue-600 text-white p-3 mx-auto cursor-pointer rounded-md"
              >
                Upload Resume
                <input
                  type="file"
                  id="upload-button"
                  className="hidden bg-bluem w-64"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </label>
              <div className="m-2 p-2 text-black">
                {uploadedFileName && <p>Uploaded File: {uploadedFileName}</p>}
              </div>
            </div>
            {extractedContent && (
              <div>
                <button
                  type="button"
                  id="generate-button"
                  className="btn bg-green-600 text-white px-4 py-2 m-1 w-72 mx-auto cursor-pointer rounded-md"
                  disabled={!uploadedFileName || isLoading}
                  onClick={generateCoverLetter}
                >
                  {isLoading ? 'Generating...' : 'Generate cover letter'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="cv bg-white h-64 rounded-md text-white p-5">
          <textarea
            className="border-2 text-black rounded-md w-full p-4 text-center drop-shadow-xl"
            id=""
            cols="30"
            rows="8"
            placeholder="Welcome to Resume to Cover Letter by Worqhat! Upload your resume and generate your cover letter."
            value={coverLetter}
            readOnly
          ></textarea>
        </div>
      </div>
    </main>
  );
}
