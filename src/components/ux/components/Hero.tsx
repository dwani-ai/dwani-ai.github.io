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
import { SiGoogleplay } from 'react-icons/si';
import {
  SecurityOutlined,
  LockOutlined,
  GavelOutlined,
  DocumentScannerOutlined,
  LanguageOutlined,
  VideoCameraFrontOutlined,
} from '@mui/icons-material';

// Styled FeatureCard (unchanged from your original code)
const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
  '&:focus-within': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
    outline: `2px solid ${theme.palette.primary.main}`,
  },
}));

// Styled Problem/Solution Card
const ProblemSolutionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[6],
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '200px',
  textAlign: 'center',
}));

// Data for Problem and Solution sections
const problems = [
  {
    text: 'Data sent to external AI providers for analysis',
    icon: <SecurityOutlined color="error" fontSize="large" />,
    chipLabel: 'Data Privacy',
  },
  {
    text: 'Not secure or private by design',
    icon: <LockOutlined color="error" fontSize="large" />,
    chipLabel: 'Security Risk',
  },
  {
    text: 'Limited control over AI model behavior',
    icon: <GavelOutlined color="error" fontSize="large" />,
    chipLabel: 'Lack of Control',
  },
];

const solutions = [
  {
    text: 'Analytics for large-scale documents and priority task identification',
    icon: <DocumentScannerOutlined color="primary" fontSize="large" />,
    chipLabel: 'Document Analytics',
  },
  {
    text: 'Self-hosted, multimodal inference with open-weight models',
    icon: <LanguageOutlined color="primary" fontSize="large" />,
    chipLabel: 'Self-Hosted AI',
  },
  {
    text: 'Private, secure, auditable, and open-source',
    icon: <LockOutlined color="primary" fontSize="large" />,
    chipLabel: 'Secure & Open',
  },
  {
    text: 'Interact with documents, images, text, voice, and video',
    icon: <VideoCameraFrontOutlined color="primary" fontSize="large" />,
    chipLabel: 'Multimodal',
  },
];

const features = [
  {
    title: 'PDF Query',
    description: 'Seamlessly query content from PDF documents.',
    components: 'Analytics',
    hardware: 'GPU',
  },
  {
    title: 'Image Query',
    description: 'Extract and query content from images.',
    components: 'Vision',
    hardware: 'GPU',
  },
  {
    title: 'Voice AI',
    description: 'Answer voice queries in Indian languages.',
    components: 'LLM',
    hardware: 'CPU/GPU',
  },
  {
    title: 'Text to Speech',
    description: 'Generate natural-sounding speech from text.',
    components: 'TTS',
    hardware: 'GPU',
  },
];

export default function Hero() {
  return (
    <>
      <title>dwani.ai | Multimodal AI Platform</title>
      <meta
        name="description"
        content="Discover dwani.ai, a GenAI platform for secure multimodal inference. Download the app on Google Play to explore voice translation, text-to-speech, and document summarization."
      />
      <meta
        name="keywords"
        content="dwani.ai, GenAI, multimodal AI, voice assistant, Indian languages, voice translation, document summarization, secure analytics"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://dwani.ai" />

      <Box
        id="hero"
        role="banner"
        sx={(theme) => ({
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          }),
          py: { xs: 8, sm: 12 },
        })}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 10, sm: 16 },
            pb: { xs: 6, sm: 10 },
          }}
        >
          <Stack
            spacing={3}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '80%', md: '60%' } }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: 'clamp(2.5rem, 7vw, 3.75rem)',
                fontWeight: 'bold',
                color: 'primary.main',
                textAlign: 'center',
              }}
            >
              dwani.ai
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontWeight: 'medium',
              }}
            >
              Knowledge from Curiosity
            </Typography>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              Secure Document Analytics for Proprietary Data
            </Typography>

            <Button
              variant="contained"
              color="primary"
              href="https://app.dwani.ai"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 2 }}
              aria-label="Try Discovery on dwani.ai"
            >
              Try Discovery
            </Button>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              Explore Multimodal Inference. Read the{' '}
              <Link
                href="https://docs.dwani.ai/"
                target="_blank"
                color="primary"
                aria-label="dwani.ai documentation"
              >
                Documentation
              </Link>.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              href="https://workshop.dwani.ai"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 2 }}
              aria-label="Try Multimodal Inference"
            >
              Try - Multimodal Inference
            </Button>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />


            {/* Problem Section */}
            <Stack
              spacing={4}
              useFlexGap
              sx={{ alignItems: 'center', width: '100%', mt: 8 }}
            >
              <Typography
                variant="h4"
                component="h3"
                sx={{ textAlign: 'center', fontWeight: 'bold' }}
              >
                The Problem - Security with AI
              </Typography>
              <Grid container spacing={3}>
                {problems.map((problem, index) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={index}>
                    <ProblemSolutionCard tabIndex={0}>
                      <Box sx={{ mb: 2 }}>{problem.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', mb: 1 }}
                      >
                        {problem.text}
                      </Typography>
                      <Chip
                        label={problem.chipLabel}
                        color="error"
                        variant="outlined"
                        size="small"
                      />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Solution Section */}
            <Stack
              spacing={4}
              useFlexGap
              sx={{ alignItems: 'center', width: '100%', mt: 6 }}
            >
              <Typography
                variant="h4"
                component="h3"
                sx={{ textAlign: 'center', fontWeight: 'bold' }}
              >
                The Solution - dwani.ai’s Discovery
              </Typography>
              <Grid container spacing={3}>
                {solutions.map((solution, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <ProblemSolutionCard tabIndex={0}>
                      <Box sx={{ mb: 2 }}>{solution.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', mb: 1 }}
                      >
                        {solution.text}
                      </Typography>
                      <Chip
                        label={solution.chipLabel}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Stack>

          {/* Features Section */}
          <Stack
            spacing={4}
            useFlexGap
            sx={{ alignItems: 'center', width: '100%', mt: 8 }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ textAlign: 'center', fontWeight: 'bold' }}
            >
              Key Features
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <FeatureCard tabIndex={0}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 1 }}
                    >
                      {feature.description}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 2, justifyContent: 'center' }}
                    >
                      <Chip
                        label={feature.components}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={feature.hardware}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
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
            sx={{ mt: 4, px: 4, py: 1.5, borderRadius: 2 }}
            aria-label="Download dwani.ai on Google Play"
            startIcon={<SiGoogleplay size={24} />}
          >
            Google Play
          </Button>

          {/* Contact Section */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: '100%', mt: 8 }}
          >
            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />
            <Typography
              variant="h4"
              component="h2"
              sx={{ textAlign: 'center', fontWeight: 'bold' }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              Join our{' '}
              <Link
                href="https://discord.gg/9Fq8J9Gnz3"
                target="_blank"
                color="primary"
                aria-label="Join dwani.ai Discord community"
              >
                Discord community
              </Link>{' '}
              for collaborations.
              <br />
              Have questions?{' '}
              <Link
                href="https://calendar.app.google/j1L2Sh6sExfWpUTZ7"
                target="_blank"
                color="primary"
                aria-label="Schedule a demo with dwani.ai"
              >
                Schedule a Demo
              </Link>.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}