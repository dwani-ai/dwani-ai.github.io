// src/components/SpeechDemo.tsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { useSelector } from 'react-redux';
import { RootState, setAudioResponse, setErrorMessage, useAppDispatch } from '../../../../redux/store';

type SpeechDemoProps = {
  serverUrl?: string;
};

const SpeechDemo = ({ serverUrl }: SpeechDemoProps) => {
  let serverBaseUrl = serverUrl || 'https://slabstech-dhwani-server.hf.space';
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [recordedUrl, setRecordedUrl] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProduction, setIsProduction] = useState(true);
  const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Use Redux state and dispatch
  const audioResponse = useSelector((state: RootState) => state.audio.audioResponse);
  const errorMessage = useSelector((state: RootState) => state.audio.errorMessage);
  const dispatch = useAppDispatch();

  const startRecording = async () => {
    setIsLoading(false);
    dispatch(setErrorMessage(''));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        disableLogs: true,
      });
      if (recorderRef.current) {
        recorderRef.current.startRecording();
        setIsRecording(true);
      } else {
        throw new Error('Failed to initialize recorder');
      }
    } catch (error) {
      console.error('Error accessing microphone or initializing recorder:', error);
      dispatch(setErrorMessage('Failed to access microphone or initialize recorder'));
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        if (blob) {
          const url = URL.createObjectURL(blob);
          const file = new File([blob], 'recording.wav', { type: 'audio/x-wav' });
          setAudioFile(file);
          setRecordedUrl(url);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        recorderRef.current = null;
        setIsRecording(false);
      });
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setIsProduction(true);
    }

    return () => {
      if (recorderRef.current || streamRef.current) {
        stopRecording();
      }
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [recordedUrl]);

  const toggleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const sendPromptToServer = async () => {
    if (!audioFile) {
      dispatch(setErrorMessage('No audio file recorded'));
      return;
    }
    setTableAIProgressLoading(true);
    dispatch(setErrorMessage(''));
    const serverEndpoint = `${serverBaseUrl}/v1/speech_to_speech_v2?language=kannada`;

    const formData = new FormData();
    formData.append('file', audioFile, 'recording.wav');

    try {
      const response = await axios.post(serverEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      console.log('Server response:', response.data);
      // Assuming the JSON response contains an audio URL or base64 data
      const audioUrl = response.data.audioUrl || response.data.url; // Adjust based on actual response
      if (!audioUrl) {
        throw new Error('No audio URL in server response');
      }
      dispatch(setAudioResponse(audioUrl));
      setTableAIProgressLoading(false);
      return audioUrl;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error processing speech:', axiosError);
      if (axiosError.response) {
        let responseText = 'Unknown server error';
        if (axiosError.response.data instanceof Blob) {
          responseText = await axiosError.response.data.text();
        } else if (typeof axiosError.response.data === 'string') {
          responseText = axiosError.response.data;
        } else if (axiosError.response.data) {
          responseText = JSON.stringify(axiosError.response.data);
        }
        dispatch(setErrorMessage(`Server error: ${responseText || 'Invalid HTTP request received'}`));
      } else if (axiosError.request) {
        dispatch(setErrorMessage('CORS error or server unreachable. Please ensure the server allows requests from this origin.'));
      } else {
        dispatch(setErrorMessage(`Request setup error: ${axiosError.message}`));
      }
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
              color={isRecording ? 'secondary' : 'primary'}
              startIcon={isRecording ? <MicIcon /> : <MicOffIcon />}
              onClick={toggleVoiceInput}
              disabled={isLoading}
            >
              {isRecording ? 'Recording' : 'Start Recording'}
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
          {errorMessage && (
            <Box sx={{ color: 'red', mt: 2 }}>{errorMessage}</Box>
          )}
          <Box id="botResult">{tableAIProgressLoading && <LinearProgress />}</Box>
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