import { useState, useEffect, useRef } from 'react';

type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface FileUploadResponse {
  file_id: string;
  filename: string;
  status: ExtractionStatus;
  message: string;
}

interface FileRetrieveResponse {
  file_id: string;
  filename: string;
  status: ExtractionStatus;
  extracted_text?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export const useDocumentExtraction = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [status, setStatus] = useState<ExtractionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  //const API_BASE = 'https://api.dwani.ai';
  const API_BASE = 'http://localhost:8000'
  const API_KEY = import.meta.env.VITE_DWANI_API_KEY;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileId(null);
      setExtractedText('');
      setStatus(null);
      setError(null);
      setPreviewUrl(null);
    } else {
      setError('Please select a valid PDF file.');
      setFile(null);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploadLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'X-API-KEY': API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }

      const data: FileUploadResponse = await response.json();
      setFileId(data.file_id);
      setStatus('pending');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to upload file'
      );
      setFileId(null);
    } finally {
      setUploadLoading(false);
    }
  };

  const fetchExtractionStatus = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/files/${id}`, {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }

      const data: FileRetrieveResponse = await response.json();
      setStatus(data.status);

      if (data.status === 'completed' && data.extracted_text) {
        setExtractedText(data.extracted_text);
      } else if (data.status === 'failed') {
        setError(data.error_message || 'Extraction failed on server');
      }
    } catch (err) {
      setError('Failed to check extraction status');
    }
  };

  // Poll when we have a file_id and status is not terminal
  useEffect(() => {
    if (!fileId || !status || status === 'completed' || status === 'failed') {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setLoading(false);
      return;
    }

    setLoading(true);

    // Initial fetch
    fetchExtractionStatus(fileId);

    // Poll every 3 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchExtractionStatus(fileId);
    }, 3000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fileId, status]);

  const handleStartExtraction = () => {
    if (file && !fileId) {
      uploadFile();
    }
  };

  const handleDownloadPdf = async () => {
    if (!fileId) return;

    try {
      const response = await fetch(`${API_BASE}/files/${fileId}/pdf`, {
        headers: {
          'X-API-KEY': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `regenerated_${file?.name || 'document.pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download regenerated PDF');
    }
  };

  const handlePreviewPdf = async () => {
    if (!fileId || previewUrl) return;  // Avoid re-fetch if already previewed

    try {
      const response = await fetch(`${API_BASE}/files/${fileId}/pdf`, {
        headers: {
          'X-API-KEY': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF for preview');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      setError('Failed to preview regenerated PDF');
    }
  };

  const reset = () => {
    setFile(null);
    setFileId(null);
    setExtractedText('');
    setStatus(null);
    setError(null);
    setLoading(false);
    setUploadLoading(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  };

  return {
    file,
    fileId,
    extractedText,
    status,
    loading: loading || uploadLoading,
    uploadLoading,
    error,
    previewUrl,
    handleFileChange,
    handleStartExtraction,
    handleDownloadPdf,
    handlePreviewPdf,
    reset,
  };
};