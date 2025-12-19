import { useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useDocumentExtraction } from './useDocumentExtraction';

export default function Digitiser() {
  const {
    file,
    fileId,
    extractedText,
    status,
    loading,
    uploadLoading,
    error,
    previewUrl,
    handleFileChange,
    handleStartExtraction,
    handleDownloadPdf,
    handlePreviewPdf,
    reset,
  } = useDocumentExtraction();

  const [previewOpen, setPreviewOpen] = useState(false);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'Uploaded – Waiting to process';
      case 'processing':
        return 'Extracting text from PDF...';
      case 'completed':
        return 'Extraction Complete';
      case 'failed':
        return 'Extraction Failed';
      default:
        return 'Ready to upload';
    }
  };

  const handleOpenPreview = () => {
    handlePreviewPdf();
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

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
        spacing={4}
        useFlexGap
        sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, maxWidth: '800px' }}
      >
        <Divider sx={{ width: '100%' }} />
        
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Document Text Extraction
        </Typography>
        
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Upload a PDF document and we'll extract clean, readable plain text using advanced vision models.
        </Typography>

        {/* Upload Controls */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center', width: '100%' }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="pdf-upload"
            disabled={!!fileId} // Prevent changing file after upload
          />
          <label htmlFor="pdf-upload">
            <Button
              variant="outlined"
              component="span"
              disabled={!!fileId}
            >
              {file ? 'Change PDF' : 'Upload PDF'}
            </Button>
          </label>

          <Button
            variant="contained"
            color="primary"
            onClick={handleStartExtraction}
            disabled={!file || !!fileId || loading}
            startIcon={uploadLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, py: 1.5 }}
          >
            {uploadLoading ? 'Uploading...' : fileId ? 'Processing...' : 'Start Extraction'}
          </Button>

          {fileId && status && (
            <Button variant="text" onClick={reset}>
              Reset
            </Button>
          )}
        </Stack>

        {/* File & Status Info */}
        {file && (
          <Typography sx={{ color: 'text.secondary' }}>
            Selected: <strong>{file.name}</strong>
          </Typography>
        )}

        {fileId && (
          <Chip
            label={getStatusText(status)}
            color={getStatusColor(status)}
            icon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ fontWeight: 'medium', px: 1 }}
          />
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Extracted Text Result */}
        {extractedText && status === 'completed' && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              width: '100%',
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Extracted Text
            </Typography>
            <Typography
              component="pre"
              sx={{
                mt: 2,
                color: 'text.primary',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                maxHeight: '60vh',
                overflow: 'auto',
                bgcolor: 'grey.50',
                p: 2,
                borderRadius: 1,
              }}
            >
              {extractedText}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(extractedText);
                }}
              >
                Copy Text
              </Button>
              <Button variant="outlined" onClick={handleOpenPreview}>
                Preview PDF
              </Button>
              <Button variant="contained" onClick={handleDownloadPdf}>
                Download PDF
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>

      {/* PDF Preview Dialog */}
      <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="lg" fullWidth>
        <DialogTitle>Regenerated PDF Preview</DialogTitle>
        <DialogContent>
          {previewUrl ? (
            <iframe
              src={previewUrl}
              style={{ width: '100%', height: '70vh', border: 'none' }}
              title="PDF Preview"
            />
          ) : (
            <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}