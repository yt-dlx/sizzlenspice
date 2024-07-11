// app/not-found.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <React.Fragment>
      <div className="max-w-full h-screen mx-auto overflow-hidden bg-[#171717] p-4">
        <div className="p-8 text-center">
          <section className="not-found-header">
            <h1 className="mb-4 text-2xl font-bold text-[#E9F0CD]">Page Not Found</h1>
          </section>

          <section className="not-found-description">
            <p className="mb-4 text-[#E9F0CD]">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          </section>

          <section className="redirect-info">
            <p className="text-[#E9F0CD]">Redirecting you to the previous page in 3 seconds...</p>
          </section>
        </div>
      </div>
    </React.Fragment>
  );
}
