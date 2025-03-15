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
  isOnline: boolean;
};


const VoiceIntegration = ({ serverUrl, isOnline }: SpeechDemoProps) => {
  let serverBaseUrl = serverUrl || "http://localhost:8000/api/v1" ;
  const isOnlineAccess = isOnline;
  
  serverBaseUrl = "http://localhost:10000/api/v1";
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
          mediaRecorder.current.ondataavailable = (event:any) => {
              chunks.current.push(event.data);
          };

          mediaRecorder.current.onstop = () => {
              const blob = new Blob(chunks.current, { type: 'audio/webm' });
              const url = URL.createObjectURL(blob);
              const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
              setAudioFile(file);
              setRecordedUrl(url);
              //uploadAudio(blob); // Call upload function after stopping
              chunks.current = []; // Reset chunks for next recording
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
    setIsProduction(true);
    /*
    if (process.env.NODE_ENV === 'production') {
      setIsProduction(true);
    }*/
  }, [isListening]);

 
/*
  const componentDidMount() {
    //this.getOrPullModel(this.state.selectedModel);
  };
*/

  const toggleVoiceInput = () => {
    if (isListening) {
      startRecording();
      //console.log('isListinening');
    } else {
      stopRecording();
     //console.log('not listnen');
    }
    //setIsListening(!isListening);
    setIsListening(!isListening);
  };

  const sendPromptToServer = async () => {
    if (!audioFile) {
      // If audioFile is null, do not proceed with the request
      return;
    }
    setTableAIProgressLoading(true);
    setAudioResponse('');
    const serverEndpoint = serverBaseUrl + '/inference/speech_to_speech_url/';
  
    const formData = new FormData();
    formData.append('audio', audioFile);
  

    try {
      const response = await axios.post(serverEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // This tells axios to return the data as a Blob object
      });
      // const messageContent = response.data.response;
      const audioUrl = window.URL.createObjectURL(new Blob([response.data]));
      setAudioResponse(audioUrl); // Save the audio URL to state
      setTableAIProgressLoading(false);

      //setTextResponse(messageContent);

      return audioUrl;
      //return messageContent;
    } catch (error) {
      console.error('Error processing Text Prompt:', (error as AxiosError).message);
      console.log('isOnline:' + isOnlineAccess);
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
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </Box>
          <Box id="botResult">
            {tableAIProgressLoading && <LinearProgress />}
          </Box>
          {audioResponse && (
          <audio controls>
            <source src={audioResponse} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
    </>
  )
}

export default VoiceIntegration;