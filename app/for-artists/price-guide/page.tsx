export default function PricingGuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Pricing Guide</h1>
      <p className="text-neutral-600 mb-6">Use cost+time+margin; include packaging and platform fees.</p>
      <ul className="space-y-3">
        <li className="border rounded-xl p-4">Cost baseline + hourly labor</li>
        <li className="border rounded-xl p-4">Market benchmarks and demand</li>
        <li className="border rounded-xl p-4">Limited editions and upsells</li>
      </ul>
    </main>
  );
}
