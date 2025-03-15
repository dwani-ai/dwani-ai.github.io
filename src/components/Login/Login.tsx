import React, { ChangeEvent } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Container,
  Button,
  TextField,
  Grid,
  Typography,
  styled
} from "@mui/material";


import { login } from "./LoginActions";

const StyledForm = styled('form')(({ theme }) => ({
  '& .MuiTextField-root': {
    margin: theme.spacing(1),
    width: '25ch',
  },
}));

const Login = ({ login, auth }:any) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  if (!auth) {
    //return null;
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onLoginClick = () => {
    const userData = {
      username: username,
      password: password
    };
    console.log("Login " + userData.username + " " + userData.password);
    login(userData, () => navigate("/dashboard"));
  };

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Login</Typography>
          <StyledForm noValidate autoComplete="off">
            <TextField
              id="usernameId"
              label="User name"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              id="passwordId"
              label="Your password"
              type="password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
            />
          </StyledForm>
          <Button variant="contained" onClick={onLoginClick}>Login</Button>
          <Typography variant="body1" className="mt-2">
            Don't have account? <Link to="/signup">Signup</Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state:any) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { login })(Login);
