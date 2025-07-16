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
import { useDocumentSummary } from './useDocumentSummary'; // Adjust path as needed
import { useTranslationDocumentSummary } from './useTranslationDocumentSummary'; // Adjust path as needed
import { useCustomPromptDocument } from './useCustomPromptDocument'; // Adjust path as needed
import { useKannadaPDFQuery } from './useKannadaPdfQuery'; // Adjust path as needed

export default function IndicDocumentFeatures() {
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

  const {
    file: transFile,
    summary: transSummary,
    translatedSummary,
    loading: transLoading,
    error: transError,
    srcLang,
    tgtLang,
    languageOptions,
    setSrcLang,
    setTgtLang,
    handleFileChange: handleTransFileChange,
    handleSummarize: handleTransSummarize,
  } = useTranslationDocumentSummary();

  const {
    file: customFile,
    response,
    translatedResponse,
    loading: customLoading,
    error: customError,
    sourceLanguage,
    targetLanguage,
    prompt,
    languageOptions: customLanguageOptions,
    setSourceLanguage,
    setTargetLanguage,
    setPrompt,
    handleFileChange: handleCustomFileChange,
    handleProcessDocument,
  } = useCustomPromptDocument();

  const {
    file: kannadaFile,
    pageNumber,
    prompt: kannadaPrompt,
    srcLang: kannadaSrcLang,
    inputInfo,
    outputInfo,
    inputImage,
    outputImage,
    outputPDF, // Added for download functionality
    loading: kannadaLoading,
    error: kannadaError,
    languageOptions: kannadaLanguageOptions,
    setPageNumber,
    setPrompt: setKannadaPrompt,
    setSrcLang: setKannadaSrcLang,
    handleFileChange: handleKannadaFileChange,
    handleProcessPDF,
  } = useKannadaPDFQuery();

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    if (outputPDF) {
      const url = window.URL.createObjectURL(outputPDF);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'translated_kannada_output.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
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


      {/* Existing Custom PDF Processing Section */}
      <Stack
        spacing={2}
        useFlexGap
        sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 4 }}
      >
        <Divider sx={{ width: '100%' }} />
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Try Custom PDF Processing
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Upload a PDF, specify a custom prompt, select languages, and get a tailored response with translation.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleCustomFileChange}
            style={{ display: 'none' }}
            id="custom-pdf-upload"
          />
          <label htmlFor="custom-pdf-upload">
            <Button variant="outlined" component="span">
              Upload PDF
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleProcessDocument}
            disabled={customLoading || !customFile || !prompt}
            sx={{
              px: 4,
              py: 1.5,
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker background for disabled state
                color: 'rgba(255, 255, 255, 0.5)', // Lighter text color for contrast
                opacity: 0.6, // Slightly reduce opacity
              },
            }}
          >
            {customLoading ? <CircularProgress size={24} /> : 'Process & Translate'}
          </Button>
        </Stack>
        {customFile && (
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Selected file: {customFile.name}
          </Typography>
        )}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 2, width: '100%', justifyContent: 'center' }}
        >
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="custom-source-language-label">Source Language</InputLabel>
            <Select
              labelId="custom-source-language-label"
              value={sourceLanguage}
              label="Source Language"
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              {customLanguageOptions.map((option) => ( // Removed unnecessary "any" type annotation
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="custom-target-language-label">Target Language</InputLabel>
            <Select
              labelId="custom-target-language-label"
              value={targetLanguage}
              label="Target Language"
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {customLanguageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}> {/* Corrected value from option to option.value */}
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
          error={!prompt && !!customError}
          helperText={!prompt && customError ? 'Please enter a prompt.' : ''}
        />
        {customError && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {customError}
          </Alert>
        )}
        {(response || translatedResponse) && (
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
          </Box>
        )}
      </Stack>

      <div style={{ display: 'none' }}> 
        
      {/* Kannada PDF Query and Translation Section */}
      <Stack
        spacing={2}
        useFlexGap
        sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 4 }}
      >
        <Divider sx={{ width: '100%' }} />
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Kannada PDF Query, Translation, and PDF Creation
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Upload a PDF, specify a page number, prompt, and source language to query and translate content.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleKannadaFileChange}
            style={{ display: 'none' }}
            id="kannada-pdf-upload"
          />
          <label htmlFor="kannada-pdf-upload">
            <Button variant="outlined" component="span">
              Upload PDF
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleProcessPDF}
            disabled={kannadaLoading || !kannadaFile || !kannadaPrompt}
            sx={{
              px: 4,
              py: 1.5,
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker background for disabled state
                color: 'rgba(255, 255, 255, 0.5)', // Lighter text color for contrast
                opacity: 0.6, // Slightly reduce opacity
              },
            }}
          >
            {kannadaLoading ? <CircularProgress size={24} /> : 'Process PDF'}
          </Button>
        </Stack>
        {kannadaFile && (
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Selected file: {kannadaFile.name}
          </Typography>
        )}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 2, width: '100%', justifyContent: 'center' }}
        >
          <TextField
            label="Page Number"
            type="number"
            value={pageNumber}
            onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
            sx={{ minWidth: 150 }}
            inputProps={{ min: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="kannada-source-language-label">Source Language</InputLabel>
            <Select
              labelId="kannada-source-language-label"
              value={kannadaSrcLang}
              label="Source Language"
              onChange={(e) => setKannadaSrcLang(e.target.value)}
            >
              {kannadaLanguageOptions.map((option) => ( // Removed unnecessary "any" type annotation
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <TextField
          label="Prompt"
          value={kannadaPrompt}
          onChange={(e) => setKannadaPrompt(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          placeholder="e.g., list the points"
          error={!kannadaPrompt && !!kannadaError}
          helperText={!kannadaPrompt && kannadaError ? 'Please enter a prompt.' : ''}
        />
        {kannadaError && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {kannadaError}
          </Alert>
        )}
        {(inputInfo || inputImage || outputInfo || outputImage) && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, width: '100%' }}>
            {inputInfo && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Input PDF Information
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                  {inputInfo}
                </Typography>
              </>
            )}
            {inputImage && (
              <>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Input PDF Preview (First Page)
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                  <img src={inputImage} alt="Input PDF Preview" style={{ maxWidth: '100%', maxHeight: 400 }} />
                </Box>
              </>
            )}
            {outputInfo && (
              <>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Output PDF Information
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                  {outputInfo}
                </Typography>
              </>
            )}
            {outputImage && (
              <>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Output PDF Preview (First Page)
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                  <img src={outputImage} alt="Output PDF Preview" style={{ maxWidth: '100%', maxHeight: 400 }} />
                </Box>
              </>
            )}
            {outputPDF && ( // Added download button for Kannada PDF
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadPDF}
                sx={{ mt: 2 }}
              >
                Download Translated PDF
              </Button>
            )}
          </Box>
        )}
      </Stack>
</div>
      {/* Existing Document Summarization Section */}
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
            sx={{
              px: 4,
              py: 1.5,
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker background for disabled state
                color: 'rgba(255, 255, 255, 0.5)', // Lighter text color for contrast
                opacity: 0.6, // Slightly reduce opacity
              },
            }}
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
                <Typography sx={{ mt: 1, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
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

      {/* Existing Document Summarization with Translation Section */}
      <Stack
        spacing={2}
        useFlexGap
        sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 4 }}
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
            onChange={handleTransFileChange}
            style={{ display: 'none' }}
            id="trans-pdf-upload"
          />
          <label htmlFor="trans-pdf-upload">
            <Button variant="outlined" component="span">
              Upload PDF
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTransSummarize}
            disabled={transLoading || !transFile}
            sx={{
              px: 4,
              py: 1.5,
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker background for disabled state
                color: 'rgba(255, 255, 255, 0.5)', // Lighter text color for contrast
                opacity: 0.6, // Slightly reduce opacity
              },
            }}
          >
            {transLoading ? <CircularProgress size={24} /> : 'Summarize & Translate'}
          </Button>
        </Stack>
        {transFile && (
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Selected file: {transFile.name}
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
        {transError && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {transError}
          </Alert>
        )}
        {(transSummary || translatedSummary) && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, width: '100%' }}>
            {transSummary && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Summary
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>{transSummary}</Typography>
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
          </Box>
        )}
      </Stack>

    </Box>
  );
}