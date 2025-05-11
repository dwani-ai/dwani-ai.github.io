import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';

export default function Research() {

  return (
    <>
      <title>Dwani - Your Kannada-Speaking Voice Buddy</title>
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
                textTransform: 'uppercase',
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
              Your Kannada-Speaking Voice Buddy
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
                fontSize: '1.1rem',
              }}
            >
              Discover dwani.ai's GenAI-powered voice assistant through our engaging video tutorials.
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
              dwani.ai leverages open-source tools for seamless performance.
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  - <Link href="https://github.com/dwani-ai/asr-indic-server" target="_blank">ASR Indic Server</Link>
                  <br />
                  - <Link href="https://github.com/dwani-ai/tts-indic-server" target="_blank">TTS Indic Server</Link>
                  <br />
                  - <Link href="https://github.com/dwani-ai/indic-translate-server" target="_blank">Indic Translate Server</Link>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  - <Link href="https://github.com/dwani-ai/docs-indic-server" target="_blank">Indic Document Server</Link>
                  <br />
                  - <Link href="https://github.com/dwani-ai/dhwani-server" target="_blank">dwani.ai Server</Link>
                  <br />
                  - <Link href="https://github.com/dwani-ai/llm-indic-server_cpu" target="_blank">LLM Indic Server</Link>
                </Typography>
              </Grid>
            </Grid>
          </Stack>
          
       </Container>
      </Box>
    </>
  );
}