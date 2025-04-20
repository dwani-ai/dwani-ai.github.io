import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

type SpeechDemoProps = {
  serverUrl?: string;
};

const SpeechDemo = ({ serverUrl }: SpeechDemoProps) => {
  let serverBaseUrl = serverUrl || "http://209.20.158.215:7860/v1";
  const chunks = useRef<Blob[]>([]);
  const [recordedUrl, setRecordedUrl] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProduction, setIsProduction] = useState(true);
  const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
  const [audioResponse, setAudioResponse] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const startRecording = async () => {
    setIsLoading(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      if (mediaRecorder.current) {
        mediaRecorder.current.ondataavailable = (event: any) => {
          chunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const blob = new Blob(chunks.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
          setAudioFile(file);
          setRecordedUrl(url);
          chunks.current = [];
        };
      }
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  useEffect(() => {
    if (isListening) {
      startRecording();
    } else {
      stopRecording();
    }
    if (process.env.NODE_ENV === 'production') {
      setIsProduction(true);
    }
  }, [isListening]);

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  const sendPromptToServer = async () => {
    if (!audioFile) {
      return;
    }
    setTableAIProgressLoading(true);
    setAudioResponse('');
    const serverEndpoint = `${serverBaseUrl}/speech_to_speech?language=kannada`;

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const response = await axios.post(serverEndpoint, formData, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const audioUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
      setAudioResponse(audioUrl);
      setTableAIProgressLoading(false);

      return audioUrl;
    } catch (error) {
      console.error('Error processing speech:', (error as AxiosError).message);
      setTableAIProgressLoading(false);
      throw error;
    }
  };

  return (
    <>
      <Box className="app-container">
        <Box>
          <h2>Speech Demo</h2>
          <Divider />
          <Box className="input-container">
            <Button
              variant="contained"
              color={isListening ? "secondary" : "primary"}
              startIcon={isListening ? <MicIcon /> : <MicOffIcon />}
              onClick={toggleVoiceInput}
              disabled={isLoading}
            >
              {isListening ? 'Recording' : 'Start Recording'}
            </Button>
            {!isProduction && recordedUrl && (
              <Button
                variant="contained"
                onClick={() => {
                  const audio = new Audio(recordedUrl);
                  audio.play();
                }}
                disabled={isProduction}
              >
                Play Recording
              </Button>
            )}
            <Button
              variant="contained"
              onClick={sendPromptToServer}
              disabled={isLoading || !audioFile}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </Box>
          <Box id="botResult">
            {tableAIProgressLoading && <LinearProgress />}
          </Box>
          {audioResponse && (
            <audio controls>
              <source src={audioResponse} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
    </>
  );
};

export default SpeechDemo;