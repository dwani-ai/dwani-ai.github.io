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
import TextField from '@mui/material/TextField';
import { useCustomPromptDocument } from './useCustomPromptDocument'; // Adjust path as needed

export default function CustomPromptDocument() {
  const {
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
  } = useCustomPromptDocument();

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
          Try Document Processing with Custom Prompt
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Upload a PDF document, specify a prompt, select languages, and get the processed response with its translation.
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
            onClick={handleProcessDocument}
            disabled={loading || !file || !prompt}
          >
            {loading ? <CircularProgress size={24} /> : 'Process & Translate'}
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
              value={sourceLanguage}
              label="Source Language"
              onChange={(e) => setSourceLanguage(e.target.value)}
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
              value={targetLanguage}
              label="Target Language"
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <TextField
          label="Custom Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          placeholder="e.g., list the key points"
          error={!prompt && !!error}
          helperText={!prompt && error ? 'Please enter a prompt.' : ''}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        {(response || translatedResponse || originalText || processedPage) && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, width: '100%' }}>
            {response && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Response
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>{response}</Typography>
              </>
            )}
            {translatedResponse && (
              <>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Translated Response
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>
                  {translatedResponse}
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