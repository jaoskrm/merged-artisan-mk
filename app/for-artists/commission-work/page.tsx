'use client';

import { useState } from 'react';

export default function CommissionWorkPage() {
  const [brief, setBrief] = useState('');
  const [size, setSize] = useState('');
  const [budget, setBudget] = useState('');

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Open the AI assistant and paste your commission brief. Use /image for concept art.');
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Commission Work</h1>
      <form onSubmit={handle} className="space-y-4">
        <input value={size} onChange={e=>setSize(e.target.value)} placeholder="Preferred size / materials" className="w-full border rounded-xl p-3"/>
        <input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Budget range" className="w-full border rounded-xl p-3"/>
        <textarea value={brief} onChange={e=>setBrief(e.target.value)} placeholder="Describe the commission…" className="w-full border rounded-xl p-3 h-40"/>
        <button className="bg-primary text-white px-6 py-3 rounded-xl">Start with AI Assistant</button>
      </form>
    </main>
  );
}
