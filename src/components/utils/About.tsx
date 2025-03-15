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
          Sanjeevini - AI Health App
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>What will Sanjeevini do ?</strong>
        </Typography>       
          <ul>
            <li>Connect with Ayushman Bharat Digital Mission and provide Medical history to Doctor's during Consultation.</li>
            <li>Provide data management facility to Doctor's with Open Source development.</li>
            <li>Notify Users about:
              <ul>
                <li>Daily medication</li>
                <li>Next appointments</li>
              </ul>
            </li>
          </ul>
        <Typography variant="body1" paragraph>
          <strong>What will Sanjeevini not do ?</strong>
        </Typography>
          <ul>
            <li>Fix health issues</li>
            <li>Provide medical advice</li>
          </ul>
        <Typography variant="body1" paragraph>
          <strong>Why Sanjeevini ?</strong>
        </Typography>
          <ul>
            <li>A family member underwent emergency angioplasty after a previous Heart attack (Myocardial Infraction) was undetected.</li>
            <li>The cardiologist requested prior health check reports, but these were unavailable instantly.</li>
            <li>Incomplete reporting can lead to misdiagnosis and underestimate the seriousness of health concerns.</li>
            <li>This can result in delayed or inappropriate treatment, which can further compromise health outcomes.</li>
          </ul>
      </Container>
      </div>
    );
  }
}

export default About;
