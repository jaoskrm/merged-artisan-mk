export default function CommunityPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Community</h1>
      <p className="text-neutral-600 mb-6">Join our social channels and newsletter to share your work and learn from others.</p>
      <div className="space-y-3">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="underline">Instagram</a>
        <a href="https://x.com" target="_blank" rel="noreferrer" className="underline block">X (Twitter)</a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="underline block">Facebook</a>
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="underline block">LinkedIn</a>
      </div>
    </main>
  );
}
