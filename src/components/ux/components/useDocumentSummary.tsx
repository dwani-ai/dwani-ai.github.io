import { useState } from 'react';

export const useDocumentSummary = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [processedPage, setProcessedPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
      setFile(null);
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        "https://api.dwani.ai/v1/indic-summarize-pdf-all",
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
              'X-API-KEY': `${import.meta.env.VITE_DWANI_API_KEY}`, 
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data.summary);
      setOriginalText(data.original_text);
      setProcessedPage(data.processed_page);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error fetching summary: ' + err.message);
      } else {
        setError('Error fetching summary: An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    summary,
    originalText,
    processedPage,
    loading,
    error,
    handleFileChange,
    handleSummarize,
  };
};