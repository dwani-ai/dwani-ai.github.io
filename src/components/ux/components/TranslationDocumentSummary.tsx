import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTranslationDocumentSummary } from './useTranslationDocumentSummary'; // Adjust path as needed

export default function TranslationDocumentSummary() {
  const {
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
  } = useTranslationDocumentSummary();

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
          Try Document Summarization with Translation
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Upload a PDF document, select languages, and get a concise summary with its translation.
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
            {loading ? <CircularProgress size={24} /> : 'Summarize & Translate'}
          </Button>
        </Stack>
        {file && (
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Selected file: {file.name}
          </Typography>
        )}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 2, width: '100%', justifyContent: 'center' }}
        >
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="source-language-label">Source Language</InputLabel>
            <Select
              labelId="source-language-label"
              value={srcLang}
              label="Source Language"
              onChange={(e) => setSrcLang(e.target.value)}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="target-language-label">Target Language</InputLabel>
            <Select
              labelId="target-language-label"
              value={tgtLang}
              label="Target Language"
              onChange={(e) => setTgtLang(e.target.value)}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        {(summary || translatedSummary || originalText || processedPage) && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, width: '100%' }}>
            {summary && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Summary
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>{summary}</Typography>
              </>
            )}
            {translatedSummary && (
              <>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Translated Summary
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>
                  {translatedSummary}
                </Typography>
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