import React from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import StatusPage from './pages/StatusPage';

const enableAuth = process.env.REACT_APP_ENABLE_AUTH === 'true';

export default function App() {
  return (
    <Layout>
      <StatusPage />
      {enableAuth && <LoginPage />}
    </Layout>
  );
}
