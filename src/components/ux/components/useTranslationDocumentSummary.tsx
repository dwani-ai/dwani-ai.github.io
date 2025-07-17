import { useState } from 'react';

// Define language options based on the backend
const languageOptions = [
  { value: 'eng_Latn', label: 'English' },
  { value: 'kan_Knda', label: 'Kannada' },
  { value: 'hin_Deva', label: 'Hindi' },
  { value: 'tam_Taml', label: 'Tamil' },
  { value: 'tel_Telu', label: 'Telugu' },
];

export const useTranslationDocumentSummary = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [processedPage, setProcessedPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [srcLang, setSrcLang] = useState('eng_Latn'); // Default to English
  const [tgtLang, setTgtLang] = useState('kan_Knda'); // Default to Kannada

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

    // Prepare form data for the unified API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tgt_lang', tgtLang);
    formData.append('model', "gemma3");

    try {
      const response = await fetch(
        "https://api.dwani.ai/v1/indic-summarize-pdf-all",
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'X-API-KEY': `${import.meta.env.VITE_DWANI_API_KEY}`, // Replace with actual API key
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process PDF summarization and translation');
      }

      const data = await response.json();
      setSummary(data.summary);
      setTranslatedSummary(data.translated_summary);
      setOriginalText(data.original_text);
      setProcessedPage(data.processed_page);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error processing request: ' + err.message);
      } else {
        setError('Error processing request: An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    summary,
    translatedSummary,
    originalText,
    processedPage,
    loading,
    error,
    srcLang,
    tgtLang,
    languageOptions,
    setSrcLang,
    setTgtLang,
    handleFileChange,
    handleSummarize,
  };
};