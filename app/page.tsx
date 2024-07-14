// app/page.tsx
"use server";
import React from "react";
import { auth } from "@/auth";
import Image from "next/image";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { VscGithubInverted } from "react-icons/vsc";
import { AiFillGoogleCircle } from "react-icons/ai";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/routes/user");
  const categories = [
    {
      title: "Palak Paneer",
      image: "/Palak_Paneer.jpg",
      description: "Spinach and paneer curry cooked with a blend of spices.",
    },
    {
      title: "Butter Chicken",
      image: "/Butter_Chicken.jpg",
      description: "A rich and creamy dish made with marinated chicken cooked in a spiced tomato sauce.",
    },
    {
      title: "Paneer Tikka",
      image: "/Paneer_Tikka.jpg",
      description: "Grilled paneer cubes marinated in spiced yogurt, served with chutney.",
    },
    {
      title: "Biryani",
      image: "/Biryani.jpg",
      description: "A fragrant rice dish cooked with meat or vegetables and aromatic spices.",
    },
  ];

  return (
    <React.Fragment>
      <main className="max-w-full mx-auto overflow-hidden bg-gradient-to-b from-[#1c3029]/30 from-10% via-[#171717] via-40% to-[#131313] to-50% p-4">
        <section className="flex flex-col md:justify-center md:items-center sm:text-center text-[#E9F0CD] font-Playfair">
          <h1 className="text-8xl sm:text-9xl font-bold text-[#E9F0CD]">Sizzle 'n Spice</h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">Where Every Bite Sizzles With Flavour and Love!</h2>
          <img src="/sns.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112 saturate-200" />
        </section>
        {/* ======================================================================================================================================================================= */}
        <section className="flex flex-col items-center justify-center max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
          <p className="text-2xl lg:text-5xl md:text-center font-Grenoble gap-2 py-4 text-[#E9F0CD]">Order delicious foods and get them at your doorsteps </p>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {categories.map((category, index) => (
              <a key={index} className="flex flex-col rounded-lg shadow border-2 border-[#1C2924] overflow-hidden h-full">
                <Image src={category.image} width={540} height={540} alt={category.title} className="object-cover w-full h-48 border-b-2 border-[#1C2924]" />
                <div className="text-[#E9F0CD] flex flex-col justify-between rounded-b m-0.5 py-2 bg-[#2B4B40]/40 flex-grow text-center">
                  <h2 className="truncate font-bold font-Kurale">{category.title}</h2>
                  <p className="text-xs mt-2 font-Playfair">{category.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
        {/* ======================================================================================================================================================================= */}
        <section className="max-w-2xl sm:max-w-4xl md:max-w-6xl text-[#E9F0CD] lg:max-w-7xl mx-auto">
          <form
            action={async (formData: FormData) => {
              "use server";
              const provider = formData.get("provider") as string;
              await signIn(provider);
            }}
          >
            <div className="gap-2 grid md:grid-cols-2 text-sm font-Kurale font-bold">
              <button
                type="submit"
                value="google"
                name="provider"
                className="shadow shadow-[#172825] w-full py-2 transition duration-700 ease-in-out transform rounded-lg bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2"
              >
                <AiFillGoogleCircle size={20} />
                Sign Up or Log in with "Google.com"
              </button>
              <button
                type="submit"
                value="github"
                name="provider"
                className="shadow shadow-[#172825] w-full py-2 transition duration-700 ease-in-out transform rounded-lg bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25] flex items-center justify-center gap-2"
              >
                <VscGithubInverted size={20} />
                Sign Up or Log in with "GitHub.com"
              </button>
            </div>
          </form>
        </section>
      </main>
    </React.Fragment>
  );
}
