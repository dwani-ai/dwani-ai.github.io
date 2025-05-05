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

    // Step 1: Summarize the PDF
    const formData = new FormData();
    formData.append('file', file);
    formData.append('page_number', '1');

    try {
      const summaryResponse = await fetch(
        'https://slabstech-dhwani-server-workshop.hf.space/v1/summarize-pdf',
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
          },
          body: formData,
        }
      );

      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch summary');
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);
      setOriginalText(summaryData.original_text);
      setProcessedPage(summaryData.processed_page);

      // Step 2: Translate the summary
      const translationPayload = {
        sentences: [summaryData.summary],
        src_lang: srcLang,
        tgt_lang: tgtLang,
      };

      const translationResponse = await fetch(
        'https://slabstech-dhwani-server-workshop.hf.space/v1/translate',
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(translationPayload),
        }
      );

      if (!translationResponse.ok) {
        throw new Error('Failed to fetch translation');
      }

      const translationData = await translationResponse.json();
      setTranslatedSummary(translationData.translations[0]);
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