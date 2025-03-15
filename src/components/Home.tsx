import { Component } from 'react';
import { Container, Typography } from '@mui/material';
interface AppState {
}

type HomeProps = {
  serverUrl: string;
};

class Home extends Component<HomeProps, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  serverBaseUrl = import.meta.env.VITE_HF_SPACES_URL;
  isOnline = true;

  constructor(props:HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  render() {
    return (
      <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Dhwani - Voice AI for Kannada
        </Typography>
      </Container>
      <div  style={{ display: 'none' }} >
      <Container>
        <Typography variant="h4" gutterBottom>
         Dhwani - Voice AI for Kannada
        </Typography>
      </Container>
      </div>
      </div>
    );
  }
}

export default Home;
