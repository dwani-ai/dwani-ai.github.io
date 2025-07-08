import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

const VideoCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[8],
  },
  '& iframe': {
    width: '100%',
    height: '315px',
    border: 'none',
    borderRadius: theme.shape.borderRadius,
  },
  [theme.breakpoints.down('sm')]: {
    '& iframe': {
      height: '200px',
    },
  },
}));

const VideoTitle = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  textAlign: 'center',
  fontWeight: 'medium',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  '.MuiBox-root:hover &': {
    opacity: 1,
  },
}));

const DiagramImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  margin: theme.spacing(2, 0),
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

export default function Tutorials() {
  const videos = [
    {
      title: 'dwani.ai Android App Demo',
      src: 'https://www.youtube.com/embed/TbplM-lWSL4?rel=0',
    },
    {
      title: 'Introduction to dwani.ai Project',
      src: 'https://www.youtube.com/embed/kqZZZjbeNVk?rel=0',
    },
    {
      title: 'dwani.ai Workshop',
      src: 'https://www.youtube.com/embed/f5JkJLQJFGA?rel=0',
    },
    {
      title: 'dwani.ai API',
      src: 'https://www.youtube.com/embed/RLIhG1bt8gw?rel=0',
    },
  ];

  return (
    <>
      <title>dwani.ai - Knowledge through Curiosity</title>
      <meta
        name="description"
        content="Dwani is a GenAI platform offering voice interaction in Kannada and other Indian languages. Watch our video tutorials to explore the dwani.ai project and its features."
      />
      <meta
        name="keywords"
        content="Dwani, Kannada AI, voice assistant, Indian languages, GenAI, video tutorials, system diagram"
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

          {/* System Diagram Section */}
          <Stack
            spacing={4}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '90%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%', borderColor: 'primary.main', borderWidth: 2 }} />
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'text.primary',
                letterSpacing: '0.03em',
              }}
            >
              dwani.ai System Diagram
            </Typography>

            <DiagramImage
              src="https://raw.githubusercontent.com/dwani-ai/deploy/refs/heads/main/images/dwani-inference.drawio.png"
              alt="dwani.ai System Diagram"
            />
          </Stack>


          {/* Videos Section */}
          <Stack
            spacing={4}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '90%' }, mt: 8 }}
          >
            <Divider sx={{ width: '100%', borderColor: 'primary.main', borderWidth: 2 }} />
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'text.primary',
                letterSpacing: '0.03em',
              }}
            >
              dwani.ai Tutorials
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: '1.1rem',
                maxWidth: '600px',
              }}
            >
              Watch our videos to learn about dwani.ai's features, from the Android app to API integration.
            </Typography>
            <Grid container spacing={3}>
              {videos.map((video, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <VideoCard>
                    <iframe
                      src={video.src}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={video.title}
                    ></iframe>
                    <VideoTitle variant="body2">{video.title}</VideoTitle>
                  </VideoCard>
                </Grid>
              ))}
            </Grid>
          </Stack>

        </Container>
      </Box>
    </>
  );
}