export default function CategoriesPage() {
  const categories = ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Paintings', 'Home Decor'];
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-6">Categories</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <a key={c} href={`/marketplace?category=${encodeURIComponent(c)}`} className="rounded-xl border p-5 hover:bg-stone-50 dark:hover:bg-neutral-900">
            {c}
          </a>
        ))}
      </div>
    </main>
  );
}
