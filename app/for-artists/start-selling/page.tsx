export default function StartSellingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Start Selling</h1>
      <ol className="list-decimal ml-6 space-y-3">
        <li>Create an account on the platform.</li>
        <li>Complete profile and portfolio.</li>
        <li>Add products with high-quality images and clear pricing.</li>
        <li>Publish and share your store link.</li>
      </ol>
      <a href="/auth" className="inline-block mt-8 bg-primary text-white px-6 py-3 rounded-xl">Create Account</a>
    </main>
  );
}
