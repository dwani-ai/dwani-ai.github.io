import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useDocumentSummary } from './useDocumentSummary'; // Adjust path as needed

export default function DocumentSummary() {
  const {
    file,
    summary,
    originalText,
    processedPage,
    loading,
    error,
    handleFileChange,
    handleSummarize,
  } = useDocumentSummary();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: { xs: 4, sm: 6 },
        pt: { xs: 10, sm: 12 },
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
        {(summary || originalText || processedPage) && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, width: '100%' }}>
            {summary && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Summary
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>{summary}</Typography>
              </>
            )}
            {originalText && (
              <>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Original Text
                </Typography>
                <Typography
                  sx={{ mt: 1, color: 'text.primary', whiteSpace: 'pre-wrap' }}
                >
                  {originalText}
                </Typography>
              </>
            )}
            {processedPage && (
              <>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Processed Page
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>
                  Page {processedPage}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}