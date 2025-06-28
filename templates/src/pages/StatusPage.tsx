import React, { useEffect, useState } from 'react';

interface StatusInfo {
  enableAuth: boolean;
  enableEf: boolean;
  enableSwagger: boolean;
  enableCors: boolean;
  enableHttpClients: boolean;
  dbConnected: boolean;
  authenticated: boolean;
  user?: string | null;
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusInfo | null>(null);

  useEffect(() => {
    fetch('/status')
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  if (!status) {
    return <p>Loading status...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-2">
      <h1 className="text-xl mb-4">Project Status</h1>
      <ul className="space-y-1">
        <li>
          <label>
            <input type="checkbox" checked={status.enableAuth} readOnly /> Authentication enabled
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" checked={status.dbConnected} readOnly /> Database connection
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" checked={status.enableSwagger} readOnly /> Swagger
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" checked={status.enableCors} readOnly /> CORS
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" checked={status.enableHttpClients} readOnly /> HttpClients
          </label>
        </li>
        {status.user && <li>Logged in as {status.user}</li>}
      </ul>
    </div>
  );
}
