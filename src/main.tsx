import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/utils/ErrorBoundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import Divider from '@mui/material/Divider';
import AppAppBar from './components/ux/components/AppAppBar';
import Hero from './components/ux/components/Hero';
import LogoCollection from './components/ux/components/LogoCollection';
import Highlights from './components/ux/components/Highlights';
import Pricing from './components/ux/components/Pricing';
import Features from './components/ux/components/Features';
import Testimonials from './components/ux/components/Testimonials';
import FAQ from './components/ux/components/FAQ';
import Footer from './components/ux/components/Footer';
import AppTheme from './components/ux/shared-theme/AppTheme';
import SignIn from './components/ux/sign-in/SignIn';
import SignUp from './components/ux/sign-up/SignUp';
import Blog from './components/ux/blog/Blog';
import UserApp from './components/User/UserApp';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <AppTheme>
              <CssBaseline enableColorScheme />
              <AppAppBar />
              <Routes>
                <Route path="/demo" element={<UserApp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/faq" element={<FAQ />} />
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <Divider />
                      <Footer />
                      <div style={{ display: 'none' }}>
                      <LogoCollection />
                      <Features />
                      <Divider />
                      <Testimonials />
                      <Divider />
                      <Highlights />
                      <Divider />
                      <Pricing />
                      <Divider />
                      </div>
                    </>
                  }
                />
              </Routes>
            </AppTheme>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  console.error("Root element not found");
}