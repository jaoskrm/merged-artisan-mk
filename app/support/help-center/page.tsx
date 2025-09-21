export default function HelpCenterPage() {
  const faqs = [
    { q: 'How to place a custom order?', a: 'Use Custom Orders page then talk to the AI assistant.' },
    { q: 'How are payments handled?', a: 'Secure payment providers; details coming soon.' },
    { q: 'Refunds & returns?', a: 'Seller policies apply; safety & trust guidelines published.' },
  ];
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Help Center</h1>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <details key={i} className="border rounded-xl p-4">
            <summary className="font-semibold">{f.q}</summary>
            <p className="text-neutral-600 mt-2">{f.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
