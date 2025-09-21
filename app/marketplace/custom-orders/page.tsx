'use client';

import { useState } from 'react';

export default function CustomOrdersPage() {
  const [desc, setDesc] = useState('');
  const [email, setEmail] = useState('');

  const openChat = () => {
    // Tip: user can paste “/image …” in chatbot for concept art
    alert('Opening AI assistant… Use the floating button and paste your brief for suggestions.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openChat();
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Custom Orders</h1>
      <p className="text-neutral-600 mb-8">Describe the custom piece required, dimensions, materials, and budget.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl p-3"/>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe your custom request…" className="w-full border rounded-xl p-3 h-40"/>
        <button className="bg-primary text-white px-6 py-3 rounded-xl">Start with AI Assistant</button>
      </form>
    </main>
  );
}
