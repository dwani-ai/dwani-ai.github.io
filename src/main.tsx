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
//import FAQ from './components/ux/components/FAQ';
import Footer from './components/ux/components/Footer';
import AppTheme from './components/ux/shared-theme/AppTheme';
//import Blog from './components/ux/blog/Blog';
//import Tutorials from './components/ux/components/Tutorials';
//import IndicDocumentFeatures from './components/ux/components/IndicDocumentFeatures';
import Research from './components/ux/components/Research';
//import API from './components/ux/components/API';

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
                
                <Route path="/research" element={<Research />} />
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