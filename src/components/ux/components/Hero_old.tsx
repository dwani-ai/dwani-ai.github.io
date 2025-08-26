import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { SiGoogleplay } from 'react-icons/si';
import { useKannadaPDFQuery } from './useKannadaPdfQuery'; // Adjust path as needed
import { useTranslationDocumentSummary } from './useTranslationDocumentSummary'; // Adjust path as needed

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

interface MuiCodeBlockProps {
  code: string;
  language?: string;
}

function MuiCodeBlock({ code, language = 'python' }: MuiCodeBlockProps) {
  return (
    <Box
      component="pre"
      sx={{
        backgroundColor: theme => theme.palette.grey[900],
        color: theme => theme.palette.common.white,
        p: 2,
        borderRadius: 1,
        overflow: 'auto',
        fontSize: '1rem',
        fontFamily: 'Fira Mono, monospace',
        mb: 2,
        width: '100%',
      }}
    >
      <code className={`language-${language}`}>
        {code}
      </code>
    </Box>
  );
}


export default function Hero() {
  const {
    file: kannadaFile,
    pageNumber,
    prompt: kannadaPrompt,
    srcLang: kannadaSrcLang,
    inputInfo,
    outputInfo,
    inputImage,
    outputImage,
    outputPDF,
    loading: kannadaLoading,
    error: kannadaError,
    languageOptions: kannadaLanguageOptions,
    setPageNumber,
    setPrompt: setKannadaPrompt,
    setSrcLang: setKannadaSrcLang,
    handleFileChange: handleKannadaFileChange,
    handleProcessPDF,
  } = useKannadaPDFQuery();


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


  const features = [
    {
      title: 'PDF Query',
      description: 'Query content from PDF documents seamlessly.',
      components: 'Analytics',
      hardware: 'GPU',
    },
    {
      title: 'Image Query',
      description: 'Query content from Images',
      components: 'Vision',
      hardware: 'GPU',
    },
    {
      title: 'Voice AI',
      description: 'Answer voice queries in Indian languages',
      components: 'LLM',
      hardware: 'CPU/GPU',
    },
    {
      title: 'Text to Speech',
      description: 'Generate natural-sounding speech from text.',
      components: 'TTS',
      hardware: 'GPU',
    }  
  ];

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
    <>
      <title>dwani.ai</title>
      <meta
        name="description"
        content="dwani.ai is a GenAI platform designed for multimodal inference . Download the app on Google Play and explore features like voice translation, text-to-speech, and document summarization."
      />
      <meta
        name="keywords"
        content="dwani, dwani.ai, Kannada AI, voice assistant, Indian languages, GenAI, voice translation, document summarization"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://dwani.ai" />

      <Box
        id="hero"
        sx={(theme) => ({
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          }),
        })}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
          >
            <Typography
              variant="h1"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              dwani.ai
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
              }}
            >
              Knowledge from Curiosity
            </Typography>



            <Divider sx={{ width: '100%' }} />
            <Divider sx={{ width: '100%' }} />


            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
              }}
            >


Secure Document Analytics
for Proprietary Data
            </Typography>


            <Divider sx={{ width: '100%' }} />
            <Divider sx={{ width: '100%' }} />


            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
              }}
            >


      Try Discovery from dwani.ai
            </Typography>

            <Button
              variant="contained"
              color="primary"
              href="https://app.dwani.ai"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5 }}
              aria-label="Discovery from dwani.ai"
            >
              app.dwani.ai
            </Button>



            <Divider sx={{ width: '100%' }} />
            <Divider sx={{ width: '100%' }} />


            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
              }}
            >


      Get started with Multimodal Inference, Read the documentation 
            </Typography>

            <Button
              variant="contained"
              color="primary"
              href="https://docs.dwani.ai/"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5 }}
              aria-label="Discovery from dwani.ai"
            >
              docs.dwani.ai
            </Button>



The Problem - Security with AI
-Data sent to external AI providers for Analysis
-Not Secure and Private by Design
-No Control over AI model behavior


The Solution - dwani.ai’s Discovery
●Analytics for Large Scale documents for Priority Task Identiﬁcation
●Built on dwani - Self-hosted, Multimodal Inference with Open weight models
●Private, Secure, Auditable, Open Source
●Interact with Documents, Images, Text, Voice and Video

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
                    labelId="kannada-source-language-label" // Corrected typo: removed "uities"
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
                  {outputPDF && (
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
          </Stack>
          
    <div style={{ display: 'none' }}> 
      

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

          {/* Features Section */}
          <Stack
            spacing={4}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '90%' }, mt: 8 }}
          >
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Key Features
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <FeatureCard>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                      {feature.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                      <Chip label={feature.components} color="primary" variant="outlined" />
                      <Chip label={feature.hardware} color="secondary" variant="outlined" />
                    </Stack>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Stack>
      
<Button
              variant="contained"
              color="primary"
              href="https://play.google.com/store/apps/details?id=com.slabstech.dhwani.voiceai&pcampaignid=web_share"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5 }}
              aria-label="Download dwani.ai on Google Play"
              startIcon={<SiGoogleplay size={24} />}
            >
              Google Play
            </Button>

          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%' }} />
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            dwani.ai – Python SDK  .<br />
            </Typography>
            <Divider sx={{ width: '100%' }} />
            <MuiCodeBlock code={
              `
      pip install dwani

      import dwani

      resp = dwani.Chat.create(
        prompt="Hello!", src_lang="eng_Latn", tgt_lang="kan_Knda")
      print(resp)`
            } language="python" />
            <MuiCodeBlock code={`{'response': 'ನಮಸ್ತೆ! ಭಾರತ ಮತ್ತು ಕರ್ನಾಟಕವನ್ನು ಗಮನದಲ್ಲಿಟ್ಟುಕೊಂಡು ಇಂದು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?'}`} language="json" />
            <Divider sx={{ width: '100%' }} />
          </Stack>
          {/* Contact Section */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%' }} />
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Get in Touch
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
              For collaborations, join our <Link href="https://discord.gg/9Fq8J9Gnz3" target="_blank">Discord community</Link>.
              <br />
              Have questions? <Link href="https://calendar.app.google/j1L2Sh6sExfWpUTZ7" target="_blank">Schedule a Demo</Link>.
            </Typography>
          </Stack>
          </div>
        </Container>
      </Box>
    </>
  );
}