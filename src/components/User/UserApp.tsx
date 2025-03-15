import { Component } from 'react';
import { Container, Grid, Typography, Divider, FormControlLabel, Switch, Toolbar } from '@mui/material';
import UserAppointments from './UserApppointments';
import DiabetesChart from './DiabetesChart';
import WeightChart from './WeightChart';
import MaternityChart from './MaternityChart';
import CardiacChart from './CardiacChart';
import Prescriptions from './Prescriptions';

interface AppState {
  showCardiacChart: boolean;
  showMaternityChart: boolean;
  showDiabetesChart: boolean;
  showWeightChart: boolean;
  showUserAppointments: boolean;
  showPrescriptions: boolean;
}

type UserAppProps = {
};

class UserApp extends Component<UserAppProps, AppState> {

  constructor(props: UserAppProps) {
    super(props);
    // Initialize all components to be shown
    this.state = {
      showCardiacChart: true,
      showMaternityChart: false,
      showDiabetesChart: true,
      showWeightChart: true,
      showUserAppointments: true,
      showPrescriptions:true,
    };
  }

  handleChange = (name: keyof AppState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [name]: event.target.checked });
  };

  render() {
    return (
      <div>
        <Container>
          <Typography variant="h4" gutterBottom>
            User Information
          </Typography>
          <Toolbar>
          <FormControlLabel
              control={
                <Switch
                  checked={this.state.showPrescriptions}
                  onChange={this.handleChange('showPrescriptions')}
                  value="prescriptions"
                  color="primary"
                />
              }
              label="Prescriptions"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.showCardiacChart}
                  onChange={this.handleChange('showCardiacChart')}
                  value="cardiacChart"
                  color="primary"
                />
              }
              label="Cardiac Chart"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.showMaternityChart}
                  onChange={this.handleChange('showMaternityChart')}
                  value="maternityChart"
                  color="primary"
                />
              }
              label="Maternity Chart"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.showDiabetesChart}
                  onChange={this.handleChange('showDiabetesChart')}
                  value="diabetesChart"
                  color="primary"
                />
              }
              label="Diabetes Chart"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.showWeightChart}
                  onChange={this.handleChange('showWeightChart')}
                  value="weightChart"
                  color="primary"
                />
              }
              label="Weight Chart"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.showUserAppointments}
                  onChange={this.handleChange('showUserAppointments')}
                  value="userAppointments"
                  color="primary"
                />
              }
              label="User Appointments"
            />
          </Toolbar>
        </Container>
        <Container>
          <Grid container spacing={2}>
          {this.state.showPrescriptions && (
              <Grid item xs={12}>
                <Prescriptions />
              </Grid>
            )}
            {this.state.showPrescriptions && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}
            {this.state.showCardiacChart && (
              <Grid item xs={12}>
                <CardiacChart />
              </Grid>
            )}
            {this.state.showCardiacChart && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}
            {this.state.showMaternityChart && (
              <Grid item xs={12}>
                <MaternityChart />
              </Grid>
            )}
            {this.state.showMaternityChart && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}
            <Grid container spacing={2}>
              {this.state.showDiabetesChart && (
                <Grid item xs={12} md={6}>
                  <DiabetesChart />
                </Grid>
              )}
              {this.state.showWeightChart && (
                <Grid item xs={12} md={6}>
                  <WeightChart />
                </Grid>
              )}
            </Grid>
            {(this.state.showDiabetesChart || this.state.showWeightChart) && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}
            {this.state.showUserAppointments && (
              <Grid item xs={12}>
                <UserAppointments />
              </Grid>
            )}
          </Grid>
        </Container>
      </div>
    );
  }
}

export default UserApp;