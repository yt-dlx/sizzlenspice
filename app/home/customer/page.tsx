// app/customer.tsx
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdFastfood } from "react-icons/md";

const CustomerPage = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair">
        <h1 className="text-6xl sm:text-7xl font-bold text-[#E9F0CD]">Welcome, {session?.user?.name}!</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">
          Explore our services and offers. <br />
          We're glad to have you here.
        </h2>
      </section>
      <section className="flex items-center justify-center">
        <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col p-8 m-2 bg-[#E9F0CD]/10 rounded-lg text-[#E9F0CD]">
          <div className="mt-6 space-y-2">
            <Link
              href={"/home"}
              className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2 font-Kurale font-bold"
            >
              <MdFastfood size={20} /> Go to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerPage;
