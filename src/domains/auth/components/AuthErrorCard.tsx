export default function AuthErrorCard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="rounded-xl border bg-white p-8 shadow-sm text-center">
        <h1 className="text-xl font-semibold">Authentication Error</h1>

        <p className="mt-3 text-slate-500">Something went wrong.</p>
      </div>
    </main>
  );
}
