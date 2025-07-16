import { useState } from 'react';
import axios from 'axios';

interface LanguageOption {
  value: string;
  label: string;
}

export const useKannadaPDFQuery = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [prompt, setPrompt] = useState<string>('list the points');
  const [srcLang, setSrcLang] = useState<string>('eng_Latn');
  const [inputInfo, setInputInfo] = useState<string>('');
  const [outputInfo, setOutputInfo] = useState<string>('');
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [outputPDF, setOutputPDF] = useState<Blob | null>(null); // New state for output PDF Blob
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const languageOptions: LanguageOption[] = [
    { value: 'eng_Latn', label: 'English' },
    { value: 'kan_Knda', label: 'Kannada' },
    // Add more languages as needed
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      // Generate input PDF preview
      generatePDFPreview(selectedFile, setInputImage);
    } else {
      setError('Please upload a valid PDF file.');
      setFile(null);
      setInputImage(null);
    }
  };

  const generatePDFPreview = async (pdfFile: File, setImage: (url: string | null) => void) => {
    try {
      const pdfJS = await import('pdfjs-dist');
      pdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfJS.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
        setImage(canvas.toDataURL('image/png'));
      }
    } catch (err) {
      console.error('Error generating PDF preview:', err);
    }
  };

  const handleProcessPDF = async () => {
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    if (pageNumber < 1) {
      setError('Page number must be at least 1.');
      return;
    }

    setLoading(true);
    setError(null);
    setInputInfo('');
    setOutputInfo('');
    setOutputImage(null);
    setOutputPDF(null); // Reset output PDF

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('page_number', pageNumber.toString());
      formData.append('prompt', prompt);
      //formData.append('src_lang', srcLang);
      formData.append('query_language', srcLang);
      formData.append('target_language', "kannada");


      const baseUrl = "https://api.dwani.ai";
      const response = await axios.post(`${baseUrl}/v1/indic-custom-prompt-pdf-all`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' ,             'X-API-KEY': `${import.meta.env.VITE_DWANI_API_BASE_URL}`, },
        responseType: 'blob',
      });

      // Input PDF Info
      const inputInfoText = `Input PDF Info:\n- Number of pages: ${await getPDFPageCount(file)}`;
      setInputInfo(inputInfoText);

      // Output PDF Info
      const outputBlob = new Blob([response.data], { type: 'application/pdf' });
      setOutputPDF(outputBlob); // Store the output PDF Blob
      const outputInfoText = `Output PDF Info:\n- Number of pages: ${await getPDFPageCount(outputBlob)}`;
      setOutputInfo(outputInfoText);

      // Generate output PDF preview
      await generatePDFPreview(new File([outputBlob], 'output.pdf', { type: 'application/pdf' }), setOutputImage);
    } catch (err: any) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPDFPageCount = async (file: File | Blob): Promise<number> => {
    try {
      const pdfJS = await import('pdfjs-dist');
      pdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfJS.getDocument(arrayBuffer).promise;
      return pdf.numPages;
    } catch (err) {
      console.error('Error getting PDF page count:', err);
      return 0;
    }
  };

  return {
    file,
    pageNumber,
    prompt,
    srcLang,
    inputInfo,
    outputInfo,
    inputImage,
    outputImage,
    outputPDF, // Return the output PDF Blob
    loading,
    error,
    languageOptions,
    setPageNumber,
    setPrompt,
    setSrcLang,
    handleFileChange,
    handleProcessPDF,
  };
};