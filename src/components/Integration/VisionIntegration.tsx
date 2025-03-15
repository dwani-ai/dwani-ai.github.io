// import React, { Component, ChangeEvent, RefObject } from 'react';
import React, { Component, ChangeEvent} from 'react';
// import Webcam from 'react-webcam';
import axios from 'axios';
import { AxiosError } from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';


type VisionProps = {
  serverUrl: string;
  isOnline: boolean;
};

interface AppState {
  base64StringImage: string | null;
  tableAIProgressLoading: boolean;
  imageresponse: any;
  imageprompt: string;
  uploadedImage: string | null;
  isLoading: boolean;
  models: Map<string, any>; 
  imageSelectedModel: string; 
  functionEndpoint:string;
}
class VisionIntegration extends Component<VisionProps, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  serverBaseUrl = 'http://localhost:10000/api/v1' ;
  webcamRef = React.createRef();
  isOnline = true;
  constructor(props:VisionProps) {
    super(props);
    //TODO - remove this
    //this.serverBaseUrl = this.props.serverUrl;
    this.isOnline = this.props.isOnline;
    this.state = {
      base64StringImage: null,
      tableAIProgressLoading: false,
      imageresponse: null,
      imageprompt: '',
      uploadedImage: null,
      isLoading: false,
      models: new Map([
        ['pixtral', 'pixtral-12b-2409'],
        ['llama3.2-vision','meta/llama-3.2-11b-vision-instruct'],
        ['llama-vision','x/llama3.2-vision:latest']
      ]), 
      //imageSelectedModel: 'pixtral',
      imageSelectedModel: 'llama-vision', 
      functionEndpoint:'/inference/llama_vision_url/',
    };
  }

  componentDidMount() {
    //this.getOrPullModel(this.state.selectedModel);
  }
  handleCapture = () => {
    //const imageSrc = this.webcamRef.current.getScreenshot();
    // You can now use the imageSrc for your upload or processing.
  };

  checkModelExists = async (modelName:string) => {
    try {
      await axios.post(`${this.ollamaBaseUrl}/show`, { name: modelName });
      return true; // Model exists
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 404) {
        return false; // Model doesn't exist
      }
      throw error; // Rethrow other errors
    }
  };

  getOrPullModel = async (modelName:string) => {
    try {
      const modelExists = await this.checkModelExists(modelName);
      if (modelExists) {
        console.log(`Model '${modelName}' already exists.`);
      } else {
        console.log(`Model '${modelName}' not found. Pulling...`);
      }
    } catch (error) {
      console.error('Error:', (error as AxiosError).message);
    }
  };

  handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          this.setState({ 
            base64StringImage: reader.result.split(',')[1],
            uploadedImage: reader.result, 
          });
        }
      }
      reader.readAsDataURL(file);
    } else {
      // handle the case where no file was selected
    }
  };


  handleImagePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ imageprompt: event.target.value });
  };

  handleImageModelChange = (event: SelectChangeEvent<string>) => {
    this.setState({ imageSelectedModel: event.target.value }, () => {
      //this.getOrPullModel(this.state.selectedModel);
      if(this.state.imageSelectedModel == 'pixtral')
        this.setState({ functionEndpoint: '/inference/vision_llm_url/' });
        //this.setS
      else if(this.state.imageSelectedModel == 'llama-vision')
        this.setState({ functionEndpoint: '/inference/llama_vision_url/' });
      else
        this.setState({ functionEndpoint: '/inference/nim_vision_llm_url/' });
    });

  };

  sendImageToServer = async () => {
     
    if (!this.state.base64StringImage) return;
    this.setState({tableAIProgressLoading:true});

    const model = this.state.models.get(this.state.imageSelectedModel);
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          prompt: this.state.imageprompt,
          image: [this.state.base64StringImage]
        }
      ],
      stream: false
    };

    console.log(requestBody);
    //const ollamaEndpoint = this.ollamaBaseUrl + '/chat';
    const serverEndpoint = this.serverBaseUrl + this.state.functionEndpoint;
//    console.log(serverEndpoint);

    try {
      const response = await axios.post(serverEndpoint, requestBody);
      //console.log("Prompt - ", this.state.prompt);
      const messageContent = response.data.response;
      this.setState({tableAIProgressLoading:false});
      //console.log('Image processing result:', messageContent);
      this.setState({ imageresponse: messageContent });
      return messageContent;
    } catch (error) {
      console.error('Error processing image:', (error as AxiosError).message);
      this.setState({tableAIProgressLoading:false});
      throw error;
    }
    
  };

  render(){
  return (
    <>
         <Box className="app-container">
        <hr /><hr />
        <h2>Vision Demo</h2>
        <Box sx={{ border: '1px solid white' }}>
          <TextField
            value={this.state.imageprompt}
            onChange={this.handleImagePromptChange}
            placeholder="Enter your prompt here..."
            fullWidth
            sx={{ backgroundColor: 'white', color: 'black' }}
          />
          <label htmlFor="upload-image">
            <Button variant="contained" component="span">
              Choose Image
            </Button>
            <input
              id="upload-image"
              type="file"
              onChange={this.handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
          <Button
            onClick={this.sendImageToServer}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? 'Processing...' : 'Submit'}
          </Button>
          <Select
            value={this.state.imageSelectedModel}
            onChange={this.handleImageModelChange}
          >
            {Array.from(this.state.models.entries()).map(([key, ]) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
          <LinearProgress
            style={{ visibility: this.state.tableAIProgressLoading ? 'visible' : 'hidden' }}
          />
          {this.state.imageresponse && (
            <Box className="response-container">
              <h4>Response:</h4>
              <textarea value={JSON.stringify(this.state.imageresponse, null, 2)} readOnly style={{ width: '95%', height: '100px' }}/>
              {this.state.uploadedImage && (
                <img
                  src={this.state.uploadedImage}
                  alt="Uploaded"
                  width="100" height="100"
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}
}

export default VisionIntegration;
