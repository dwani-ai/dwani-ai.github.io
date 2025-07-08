import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

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

export default function API() {
  return (
    <>
      <title>dwani.ai - Knowledge through Curiosity</title>
      <meta
        name="description"
        content="dwani.ai is a GenAI platform offering voice interaction in Kannada and other Indian languages."
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

          <Stack
      spacing={2}
      useFlexGap
      sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, mt: 8 }}
    >
      <Divider sx={{ width: '100%' }} />
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        dwani.ai – Python Library
      </Typography>

      <Divider sx={{ width: '100%' }} />

      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Install the library
      </Typography>
      <MuiCodeBlock code={`pip install --upgrade dwani`} language="bash" />

      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Setup the credentials
      </Typography>
      <MuiCodeBlock code={
`import dwani
import os

dwani.api_key = os.getenv("DWANI_API_KEY")
dwani.api_base = os.getenv("DWANI_API_BASE_URL")`
      } language="python" />

      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Examples
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Text Query
      </Typography>
      <MuiCodeBlock code={
`resp = dwani.Chat.create(prompt="Hello!", src_lang="eng_Latn", tgt_lang="kan_Knda")
print(resp)`
      } language="python" />
      <MuiCodeBlock code={`{'response': 'ನಮಸ್ತೆ! ಭಾರತ ಮತ್ತು ಕರ್ನಾಟಕವನ್ನು ಗಮನದಲ್ಲಿಟ್ಟುಕೊಂಡು ಇಂದು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?'}`} language="json" />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Vision Query
      </Typography>
      <MuiCodeBlock code={
`result = dwani.Vision.caption(
    file_path="image.png",
    query="Describe this logo",
    src_lang="eng_Latn",
    tgt_lang="kan_Knda"
)
print(result)`
      } language="python" />
      <MuiCodeBlock code={`{'answer': 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಚಿತ್ರದ ಸಾರಾಂಶವನ್ನು ಇಲ್ಲಿ ನೀಡಲಾಗಿದೆಃ ...'}`} language="json" />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Speech to Text (ASR)
      </Typography>
      <MuiCodeBlock code={
`result = dwani.ASR.transcribe(file_path="kannada_sample.wav", language="kannada")
print(result)`
      } language="python" />
      <MuiCodeBlock code={`{'text': 'ಕರ್ನಾಟಕ ದ ರಾಜಧಾನಿ ಯಾವುದು'}`} language="json" />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Translate
      </Typography>
      <MuiCodeBlock code={
`resp = dwani.Translate.run_translate(sentences=["hi"], src_lang="eng_Latn", tgt_lang="kan_Knda")
print(resp)`
      } language="python" />
      <MuiCodeBlock code={`{'translations': ['ಹಾಯ್']}`} language="json" />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Text to Speech (Speech Synthesis)
      </Typography>
      <MuiCodeBlock code={
`response = dwani.Audio.speech(input="ಕರ್ನಾಟಕ ದ ರಾಜಧಾನಿ ಯಾವುದು", response_format="mp3")
with open("output.mp3", "wb") as f:
    f.write(response)`
      } language="python" />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Document – Extract Text
      </Typography>
      <MuiCodeBlock code={
`result = dwani.Documents.run_extract(
    file_path="dwani-workshop.pdf",
    page_number=1,
    src_lang="eng_Latn",
    tgt_lang="kan_Knda"
)
print(result)`
      } language="python" />
      <MuiCodeBlock code={
`{'pages': [{'processed_page': 1, 'page_content': 'a plain text representation of the document', 'translated_content': 'ಡಾಕ್ಯುಮೆಂಟ್ನ ಸರಳ ಪಠ್ಯ ಪ್ರಾತಿನಿಧ್ಯವನ್ನು ಇಲ್ಲಿ ನೀಡಲಾಗಿದೆ, ಅದನ್ನು ಸ್ವಾಭಾವಿಕವಾಗಿ ಓದುವಂತೆಃ'}]}`
      } language="json" />


    </Stack>

       </Container>
      </Box>
    </>
  );
}