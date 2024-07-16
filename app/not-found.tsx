// app/not-found.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/routes");
    }, 3000);
    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="max-w-full h-screen mx-auto overflow-hidden bg-primary p-4">
      <div className="p-8 text-center">
        <section className="not-found-header">
          <h1 className="mb-4 text-2xl font-bold text-secondary">Page Not Found</h1>
        </section>
        <section className="not-found-description">
          <p className="mb-4 text-secondary">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </section>
        <section className="redirect-info">
          <p className="text-secondary">Redirecting you to the previous page in 3 seconds...</p>
        </section>
      </div>
    </div>
  );
}
