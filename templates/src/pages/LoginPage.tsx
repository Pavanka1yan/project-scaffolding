import React from 'react';

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl mb-4">Login</h1>
      <form className="space-y-2">
        <input className="border p-2 w-full" placeholder="Username" />
        <input type="password" className="border p-2 w-full" placeholder="Password" />
        <button className="bg-blue-600 text-white px-4 py-2 w-full">Sign in</button>
      </form>
    </div>
  );
}
