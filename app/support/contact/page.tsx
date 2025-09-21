'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [ok, setOk] = useState<boolean | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setOk(r.ok);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Contact Us</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border rounded-xl p-3" placeholder="Name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })}/>
        <input className="w-full border rounded-xl p-3" placeholder="Email" value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })}/>
        <input className="w-full border rounded-xl p-3" placeholder="Subject" value={form.subject} onChange={e=>setForm({ ...form, subject: e.target.value })}/>
        <textarea className="w-full border rounded-xl p-3 h-40" placeholder="Message" value={form.message} onChange={e=>setForm({ ...form, message: e.target.value })}/>
        <button className="bg-primary text-white px-6 py-3 rounded-xl">Send</button>
      </form>
      {ok === true && <p className="text-green-600 mt-4">Message sent. We will reply soon.</p>}
      {ok === false && <p className="text-red-600 mt-4">Failed to send. Try again later.</p>}
      <div className="mt-8">
        <a href="mailto:support@artisans.example" className="underline">Or email support@artisans.example</a>
      </div>
    </main>
  );
}
