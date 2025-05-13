// src/components/ux/components/AppAppBar.tsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DwaniAIIcon from './DwaniAIIcon';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme).palette.divider,
  backgroundColor: theme.palette.background.default,
  boxShadow: (theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleDocsClick = () => {
    navigate('/docs');
    toggleDrawer(false)();
  };

  const handleTutorialsClick = () => {
    navigate('/tutorials');
    toggleDrawer(false)();
  };


  const handleResearchClick = () => {
    navigate('/research');
    toggleDrawer(false)();
  };

  const handleAPIClick = () => {
    navigate('/api');
    toggleDrawer(false)();
  };
  const handleDemoClick = () => {
    navigate('/demo');
    toggleDrawer(false)();
  };

  const handleSignInClick = () => {
    navigate('/signin');
    toggleDrawer(false)();
  };
  const handleSignUpClick = () => {
    navigate('/signup');
    toggleDrawer(false)();
  };
  const handleBlogClick = () => {
    navigate('/blog');
    toggleDrawer(false)();
  };
  const handleHomeClick = () => {
    navigate('/');
    toggleDrawer(false)();
  };
  const handleFAQClick = () => {
    navigate('/faq');
    toggleDrawer(false)();
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <DwaniAIIcon />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small" onClick={handleHomeClick}>
                Home
              </Button>
              <Button variant="text" color="info" size="small" onClick={handleDocsClick}>
                Demo
              </Button>
              <Button variant="text" color="info" size="small" onClick={handleTutorialsClick}>
                Tutorials
              </Button>
              <Button variant="text" color="info" size="small" onClick={handleResearchClick}>
                Research
              </Button>
              <Button variant="text" color="info" size="small" onClick={handleAPIClick}>
                API
              </Button>
              <div style={{ display: 'none' }}> 
              <Button variant="text" color="info" size="small" onClick={handleDemoClick}>
                Demo
              </Button>
              </div>
            <div style={{ display: 'none' }}>
              <Button variant="text" color="info" size="small">
                Testimonials
              </Button>
              <Button variant="text" color="info" size="small">
                Highlights
              </Button>
              <Button variant="text" color="info" size="small">
                Pricing
              </Button>
            </div>
            <div style={{ display: 'none' }}>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={handleFAQClick}>
                FAQ
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={handleBlogClick}>
                Blog
              </Button>
              </div>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'none' }}>
            <Button color="primary" variant="text" size="small" onClick={handleSignInClick}>
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" onClick={handleSignUpClick}>
              Sign up
            </Button>
            </div>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleHomeClick}>
                    Home
                  </Button>
                  </MenuItem>
                  <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleDocsClick}>
                    Demo
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleTutorialsClick}>
                    Tutorials
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleResearchClick}>
                    Research
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleAPIClick}>
                    API
                  </Button>
                </MenuItem>
                <div style={{ display: 'none' }}>

                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                </div>
                <div style={{ display: 'none' }}>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleDemoClick}>
                    Demo
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleFAQClick}>
                    FAQ
                  </Button>
                </MenuItem>
                <MenuItem>                  
                  <Button color="primary" variant="contained" fullWidth onClick={handleBlogClick}>
                    Blog
                  </Button>
                </MenuItem>
                </div>
                <Divider sx={{ my: 3 }} />
                <div style={{ display: 'none' }}>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={handleSignUpClick}>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth onClick={handleSignInClick}>
                    Sign in
                  </Button>
                </MenuItem>
                </div>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}