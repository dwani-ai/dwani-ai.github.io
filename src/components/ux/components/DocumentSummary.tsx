import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useState } from 'react';

export default function DocumentSummary() {
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: { xs: 4, sm: 6 },
        pt: { xs: 10, sm: 12 }, // Added top padding to clear app bar
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Stack
        spacing={2}
        useFlexGap
        sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
      >
        <Divider sx={{ width: '100%' }} />
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Try Document Summarization
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Upload a PDF document and get a concise summary in 3 sentences.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            <Button variant="outlined" component="span">
              Upload PDF
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSummarize}
            disabled={loading || !file}
          >
            {loading ? <CircularProgress size={24} /> : 'Summarize'}
          </Button>
        </Stack>
        {file && (
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Selected file: {file.name}
          </Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        {summary && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              Summary
            </Typography>
            <Typography sx={{ mt: 1, color: 'text.primary' }}>{summary}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}