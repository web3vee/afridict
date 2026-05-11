import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript, localStorageManager } from '@chakra-ui/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { I18nProvider } from './i18n/I18nProvider';
import { Web3Provider } from './hooks/useWeb3';
import { polygon } from 'viem/chains';
import theme from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <PrivyProvider
      appId="cmo56zqwp069r0cl3etvansfw"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#ffd700',
        },
        loginMethods: ['email', 'google', 'wallet'],
        defaultChain: polygon,
        supportedChains: [polygon],
      }}
    >
      <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
        <Web3Provider>
          <I18nProvider>
            <BrowserRouter>
              <AppProvider>
                <App />
              </AppProvider>
            </BrowserRouter>
          </I18nProvider>
        </Web3Provider>
      </ChakraProvider>
    </PrivyProvider>
  </React.StrictMode>
);

