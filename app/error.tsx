// app/error.tsx
"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-full h-screen mx-auto overflow-hidden bg-[#171717] p-4">
      <div className="p-8 text-center">
        <section className="error-header">
          <h1 className="mb-4 text-2xl font-bold text-[#E9F0CD]">Oops! Something went wrong</h1>
        </section>
        <section className="error-description">
          <p className="mb-4 text-[#E9F0CD]">We&apos;re sorry, but an error occurred while processing your request.</p>
          <p className="mb-4 text-[#E9F0CD]">Error: {error.message || "Unknown error"}</p>
        </section>
        <section className="error-action">
          <button onClick={reset} className="px-4 py-2 mt-4 font-bold transition duration-300 ease-in-out bg-blue-500 rounded-full hover:bg-blue-600 text-[#E9F0CD]">
            Try again
          </button>
        </section>
      </div>
    </div>
  );
}
