import { useState } from 'react';

// Define language options based on the backend
const languageOptions = [
  { value: 'eng_Latn', label: 'English' },
  { value: 'kan_Knda', label: 'Kannada' },
  { value: 'hin_Deva', label: 'Hindi' },
  { value: 'tam_Taml', label: 'Tamil' },
  { value: 'tel_Telu', label: 'Telugu' },
];

export const useCustomPromptDocument = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [response, setResponse] = useState('');
  const [translatedResponse, setTranslatedResponse] = useState('');
  const [processedPage, setProcessedPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn'); // Default to English
  const [targetLanguage, setTargetLanguage] = useState('kan_Knda'); // Default to Kannada
  const [prompt, setPrompt] = useState('list the key points'); // Default prompt

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

  const handleProcessDocument = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError(null);

    // Prepare form data for the unified API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('page_number', '1');
    formData.append('prompt', prompt);
    formData.append('source_language', sourceLanguage);
    formData.append('target_language', targetLanguage);

    try {
      const response = await fetch(
        "https://api.dwani.ai/v1/indic-custom-prompt-pdf-all",
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
        throw new Error('Failed to process PDF with custom prompt');
      }

      const data = await response.json();
      setOriginalText(data.original_text);
      setResponse(data.query_answer);
      setTranslatedResponse(data.translated_query_answer);
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
    originalText,
    response,
    translatedResponse,
    processedPage,
    loading,
    error,
    sourceLanguage,
    targetLanguage,
    prompt,
    languageOptions,
    setSourceLanguage,
    setTargetLanguage,
    setPrompt,
    handleFileChange,
    handleProcessDocument,
  };
};