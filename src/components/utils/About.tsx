import { Component } from 'react';
import { Container, Typography } from '@mui/material';

interface AppState {
}

type AboutProps = {
};

class About extends Component<AboutProps, AppState> {


  constructor(props:AboutProps) {
    super(props);
  }

  render() {
    return (
      <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          dwani.ai - Voice AI for Kannada
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>What will dwani.ai Do ?</strong>
        </Typography>       
          <ul>
            <li>Assist with Kannada AI</li>
          </ul>
        <Typography variant="body1" paragraph>
          <strong>What will dwani.ai not do ?</strong>
        </Typography>
          <ul>
            <li>Solve AI for all Indian Languages</li>
          </ul>
        <Typography variant="body1" paragraph>
          <strong>Why dwani.ai ?</strong>
        </Typography>
          <ul>
            <li>Use Kannada AI in everyday life</li>
          </ul>
      </Container>
      </div>
    );
  }
}

export default About;
