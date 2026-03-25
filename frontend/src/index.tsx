import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ChakraProvider>
  </React.StrictMode>
);