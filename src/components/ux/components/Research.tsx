import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import {
  SpeedOutlined,
  MicOutlined,
  TranslateOutlined,
  DocumentScannerOutlined,
  LanguageOutlined,
  StorageOutlined,
} from '@mui/icons-material';

// Styled Card for Research Goals and Models/Tools
const ResearchCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[6],
  },
  '&:focus-within': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[6],
    outline: `2px solid ${theme.palette.primary.main}`,
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: theme.spacing(24), // Dynamic height based on theme
  textAlign: 'center',
}));

// Data for Research Goals
const researchGoals = [
  {
    text: 'Improve Time to First Token Generation (TTFTG) for ASR, Translation, and TTS systems.',
    icon: <SpeedOutlined color="primary" fontSize="large" />,
    chipLabel: 'Performance',
  },
  {
    text: 'Develop a Kannada voice model meeting industry standards (OpenAI, Google, ElevenLabs, xAI).',
    icon: <MicOutlined color="primary" fontSize="large" />,
    chipLabel: 'Kannada Voice',
  },
  {
    text: 'Create robust voice solutions for Indian languages, with a focus on Kannada.',
    icon: <TranslateOutlined color="primary" fontSize="large" />,
    chipLabel: 'Indian Languages',
  },
];

// Data for Models and Tools
const modelsAndTools = [
  {
    text: 'ASR Indic Server',
    link: 'https://github.com/dwani-ai/asr-indic-server',
    icon: <MicOutlined color="secondary" fontSize="large" />,
    chipLabel: 'Speech Recognition',
    ariaLabel: 'Visit ASR Indic Server on GitHub',
  },
  {
    text: 'TTS Indic Server',
    link: 'https://github.com/dwani-ai/tts-indic-server',
    icon: <DocumentScannerOutlined color="secondary" fontSize="large" />,
    chipLabel: 'Text-to-Speech',
    ariaLabel: 'Visit TTS Indic Server on GitHub',
  },
  {
    text: 'Indic Translate Server',
    link: 'https://github.com/dwani-ai/indic-translate-server',
    icon: <TranslateOutlined color="secondary" fontSize="large" />,
    chipLabel: 'Translation',
    ariaLabel: 'Visit Indic Translate Server on GitHub',
  },
  {
    text: 'Indic Document Server',
    link: 'https://github.com/dwani-ai/docs-indic-server',
    icon: <DocumentScannerOutlined color="secondary" fontSize="large" />,
    chipLabel: 'Document Processing',
    ariaLabel: 'Visit Indic Document Server on GitHub',
  },
  {
    text: 'dwani.ai Server',
    link: 'https://github.com/dwani-ai/dhwani-server',
    icon: <StorageOutlined color="secondary" fontSize="large" />,
    chipLabel: 'Core Server',
    ariaLabel: 'Visit dwani.ai Server on GitHub',
  },
  {
    text: 'LLM Indic Server',
    link: 'https://github.com/dwani-ai/llm-indic-server_cpu',
    icon: <LanguageOutlined color="secondary" fontSize="large" />,
    chipLabel: 'Language Model',
    ariaLabel: 'Visit LLM Indic Server on GitHub',
  },
];

export default function Research() {
  return (
    <>
      <title>dwani.ai - Knowledge through Curiosity</title>
      <meta
        name="description"
        content="Dwani is a GenAI platform offering voice interaction in Kannada and other Indian languages. Watch our video tutorials to explore the dwani.ai project and its features."
      />
      <meta
        name="keywords"
        content="Dwani, Kannada AI, voice assistant, Indian languages, GenAI, video tutorials"
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
          minHeight: '100vh',
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
                textTransform: 'smallcase',
                letterSpacing: '0.05em',
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
                fontWeight: 'medium',
              }}
            >
              Knowledge through Curiosity
            </Typography>
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
            <Grid container spacing={3}>
              {researchGoals.map((goal, index) => (
                <Grid size={{ xs: 12, sm: 4 }} key={index}>
                  <ResearchCard tabIndex={0} role="article">
                    <Box sx={{ mb: 2 }}>{goal.icon}</Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      {goal.text}
                    </Typography>
                    <Chip
                      label={goal.chipLabel}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </ResearchCard>
                </Grid>
              ))}
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
              dwani.ai leverages open-source tools for seamless performance.
            </Typography>
            <Grid container spacing={2}>
              {modelsAndTools.map((tool, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <ResearchCard tabIndex={0} role="article">
                    <Box sx={{ mb: 2 }}>{tool.icon}</Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                      <Link
                        href={tool.link}
                        target="_blank"
                        color="primary"
                        underline="hover"
                        aria-label={tool.ariaLabel}
                      >
                        {tool.text}
                      </Link>
                    </Typography>
                    <Chip
                      label={tool.chipLabel}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  </ResearchCard>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
}