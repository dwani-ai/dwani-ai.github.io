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
import { useTranslationDocumentSummary } from './useTranslationDocumentSummary'; // Adjust path as needed
import { useCustomPromptDocument } from './useCustomPromptDocument'; // Adjust path as needed

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out', // Fixed typo: 'Tiffany' -> 'transform'
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

export default function Hero() {

  // Existing Translation Document Summary hook
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

  // New Custom PDF Document hook
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

  const features = [
    {
      title: 'Kannada Voice AI',
      description: 'Answer voice queries in Kannada using a powerful LLM.',
      components: 'LLM',
      hardware: 'CPU/GPU',
    },
    {
      title: 'Voice to Voice Translation',
      description: 'Convert spoken language to text, translate, and generate speech.',
      components: 'ASR, Translation, TTS',
      hardware: 'GPU',
    },
    {
      title: 'Text to Speech',
      description: 'Generate natural-sounding speech from text.',
      components: 'TTS',
      hardware: 'GPU',
    },
    {
      title: 'PDF Translate',
      description: 'Translate content from PDF documents seamlessly.',
      components: 'Translation',
      hardware: 'GPU',
    },
    {
      title: 'Document Summary',
      description: 'Summarize PDF documents into concise text.',
      components: 'LLM',
      hardware: 'GPU',
    },
  ];

  return (
    <>
      <title>Dwani - Your Kannada-Speaking Voice Buddy</title>
      <meta
        name="description"
        content="Dwani is a GenAI platform offering voice interaction in Kannada and other Indian languages. Download the app on Google Play and explore features like voice translation, text-to-speech, and document summarization."
      />
      <meta
        name="keywords"
        content="Dwani, Kannada AI, voice assistant, Indian languages, GenAI, voice translation, document summarization"
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
          {/* Hero Section */}
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
              Your Kannada-Speaking Voice Buddy
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
              }}
            >
              Chat in Kannada with dwani.ai's GenAI-powered voice assistant, supporting multiple Indian languages.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              href="https://play.google.com/store/apps/details?id=com.slabstech.dhwani.voiceai&pcampaignid=web_share"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5 }}
              aria-label="Download Dwani on Google Play"
            >
              Download on Google Play
            </Button>

            {/* Existing Document Summary with Translation Section */}
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

            {/* New Custom PDF Document Processing Section */}
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
                    {customLanguageOptions.map((option:any) => (
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
                    {customLanguageOptions.map((option:any) => (
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

          {/* Research Goals Section */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%' }} />
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Research Goals
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
              - Improve Time to First Token Generation (TTFTG) for ASR, Translation, and TTS systems.
              <br />
              - Develop a Kannada voice model meeting industry standards (OpenAI, Google, ElevenLabs, xAI).
              <br />
              - Create robust voice solutions for Indian languages, with a focus on Kannada.
            </Typography>
          </Stack>

          {/* Videos Section */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%' }} />
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Explore dwani.ai
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/TbplM-lWSL4?rel=0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="dwani.ai Android App Demo"
                ></iframe>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/kqZZZjbeNVk?rel=0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Introduction to dwani.ai Project"
                ></iframe>
              </Grid>
            </Grid>
          </Stack>

          {/* Models and Tools Section */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%' }} />
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Models and Tools
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
              dwani.ai leverages open-source tools for seamless performance. {/* Fixed incomplete sentence */}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  - <Link href="https://github.com/slabstech/asr-indic-server" target="_blank">ASR Indic Server</Link>
                  <br />
                  - <Link href="https://github.com/slabstech/tts-indic-server" target="_blank">TTS Indic Server</Link>
                  <br />
                  - <Link href="https://github.com/slabstech/indic-translate-server" target="_blank">Indic Translate Server</Link>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  - <Link href="https://github.com/slabstech/docs-indic-server" target="_blank">Indic Document Server</Link>
                  <br />
                  - <Link href="https://github.com/slabstech/dhwani-server" target="_blank">dwani.ai Server</Link>
                  <br />
                  - <Link href="https://github.com/slabstech/llm-indic-server_cpu" target="_blank">LLM Indic Server</Link>
                </Typography>
              </Grid>
            </Grid>
          </Stack>

          {/* Workshop and API Section */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%' }} />
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Learn More
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Our workshop on March 20, 2025, to explore dwani.ai.
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/f5JkJLQJFGA?rel=0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="dwani.ai Workshop"
                ></iframe>
              </Grid>
            </Grid>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
              Access dwani.ai via our API for developers.
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/RLIhG1bt8gw?rel=0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="dwani.ai API"
                ></iframe>
              </Grid>
            </Grid>
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
              For collaborations, join our <Link href="https://discord.gg/WZMCerEZ2P" target="_blank">Discord community</Link>.
              <br />
              Have questions? <Link href="https://github.com/slabstech/dhwani-server/issues" target="_blank">Open an issue on GitHub</Link>.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}