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

export default function Hero() {
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
  ];

  return (
    <>
 
        <title>Dwani - Your Kannada-Speaking Voice Buddy</title>
        <meta
          name="description"
          content="Dwani is a GenAI platform offering voice interaction in Kannada and other Indian languages. Download the app on Google Play and explore features like voice translation, text-to-speech, and more."
        />
        <meta name="keywords" content="Dwani, Kannada AI, voice assistant, Indian languages, GenAI, voice translation" />
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

            <Grid container spacing={2} sx={{ mt: 2 }}>
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
            dwani.ai leverages open-source tools for seamless performance:
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