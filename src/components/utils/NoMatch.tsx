import { Container, Typography } from '@mui/material';

const NoMatch = () => {
  return (
    <Container>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2">
        Page not found
      </Typography>
    </Container>
  );
};

export default NoMatch;
