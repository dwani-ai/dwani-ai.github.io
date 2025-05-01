import { useState } from 'react';

export const useDocumentSummary = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
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
    formData.append('src_lang', 'eng_Latn');
    formData.append('tgt_lang', 'eng_Latn');
    formData.append('prompt', 'Summarize the document in 3 sentences.');

    try {
      const response = await fetch(
        'https://slabstech-dhwani-server-workshop.hf.space/v1/document_summary_v0',
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data.summary);
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

  return { file, summary, loading, error, handleFileChange, handleSummarize };
};