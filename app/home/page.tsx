// app/home/page.tsx
import React from "react";
import Link from "next/link";
import { MdError, MdBusiness, MdPeople, MdRestaurant } from "react-icons/md";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-[#1C3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4">
      <section id="header" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair">
        <h1 className="text-6xl sm:text-7xl font-bold text-[#E9F0CD]">Select a Page</h1>
        <div className="flex flex-wrap justify-center mt-8 gap-4">
          <Link href="/home/company">
            <p className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] rounded-lg text-xl font-Kurale font-bold">
              <MdBusiness size={30} /> Company Page
            </p>
          </Link>
          <Link href="/home/customer">
            <p className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] rounded-lg text-xl font-Kurale font-bold">
              <MdPeople size={30} /> Customer Page
            </p>
          </Link>
          <Link href="/home/restaurant">
            <p className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] rounded-lg text-xl font-Kurale font-bold">
              <MdRestaurant size={30} /> Restaurant Page
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
