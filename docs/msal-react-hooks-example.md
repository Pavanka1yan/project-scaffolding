# Integrating MSAL in React with Hooks

When your `scaffold.config.json` sets `"enableAuth": true` and `"auth": "MSAL"` (see the config snippet in the README), the generated React app can be configured to authenticate with Azure Active Directory using the `@azure/msal-react` library. The integration is gated by the `REACT_APP_ENABLE_AUTH` environment variable so authentication can be toggled per environment.

Below is a sample integration using React hooks.

```tsx
// src/auth/msalConfig.ts
import { Configuration } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
  },
};

export default msalConfig;
```

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import App from './App';
import msalConfig from './auth/msalConfig';

const pca = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
```

```tsx
// src/components/SignInButton.tsx
import { useMsal } from '@azure/msal-react';

export function SignInButton() {
  const { instance } = useMsal();
  const handleLogin = () => {
    instance.loginPopup();
  };
  return <button onClick={handleLogin}>Sign In</button>;
}
```

```tsx
// src/components/SignOutButton.tsx
import { useMsal } from '@azure/msal-react';

export function SignOutButton() {
  const { instance } = useMsal();
  const handleLogout = () => {
    instance.logoutPopup();
  };
  return <button onClick={handleLogout}>Sign Out</button>;
}
```

Use `useIsAuthenticated` to protect routes or components. The above hooks-based setup provides a simple way to authenticate users in your generated React project.
