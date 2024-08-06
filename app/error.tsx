// app/error.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MdFastfood, MdError } from "react-icons/md";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { data: session } = useSession();
  return (
    <div className="bg-primary p-4">
      <header
        id="header"
        className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-secondary"
      >
        <h1 className="text-6xl sm:text-7xl text-secondary">Oops! Something went wrong</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">
          Here's the error page, <span className="underline">{session?.user?.name}</span>!
        </h2>
        <Image
          src="/svg/error.gif"
          alt="Error illustration"
          width={300}
          height={300}
          className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-180"
        />
      </header>
      <main className="flex items-center justify-center">
        <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col p-8 m-2 bg-secondary/10 rounded-lg text-secondary">
          <div className="flex items-center justify-center gap-2 text-xl xl:text-6xl">
            <MdError size={80} className="animate-pulse text-secondary" />
            {error && <p className="text-red-500">{error.toString()}</p>}
          </div>
          <div className="mt-6 space-y-2">
            <Link
              href="/routes"
              className="w-full p-2 transition duration-700 ease-in-out transform rounded-full bg-secondary hover:bg-[#A8B67C] text-primary flex items-center justify-center gap-2"
            >
              <MdFastfood size={20} /> Go to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
