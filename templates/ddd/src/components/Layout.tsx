import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="p-4 bg-blue-600 text-white">My App</header>
      <main className="p-4">{children}</main>
    </div>
  );
}
