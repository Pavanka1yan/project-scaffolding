import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import msalConfig from './auth/msalConfig';

const enableAuth = process.env.REACT_APP_ENABLE_AUTH === 'true';

const Root = () => {
  if (enableAuth) {
    const pca = new PublicClientApplication(msalConfig);
    return (
      <MsalProvider instance={pca}>
        <App />
      </MsalProvider>
    );
  }
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
