// app/page.tsx
"use server";
import React from "react";
import Image from "next/image";
import { auth, signIn } from "@/auth";
import { ImLeaf } from "react-icons/im";
import { redirect } from "next/navigation";
import Navbar from "@/app/_utils/_components/Navbar";
import Footer from "@/app/_utils/_components/Footer";
import { VscGithubInverted } from "react-icons/vsc";
import { AiFillGoogleCircle } from "react-icons/ai";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/cart");
  const categories = [
    {
      image: "/Spicy_Chicken_Curry.jpg",
      title: "Spicy Chicken Curry",
      count: 8,
    },
    {
      image: "/Pasta_Carbonara.jpg",
      title: "Pasta Carbonara",
      count: 8,
    },
    {
      image: "/Tuna_Poke_Bowl.jpg",
      title: "Tuna Poke Bowl",
      count: 8,
    },
    {
      image: "/Mushroom_Risotto.jpg",
      title: "Mushroom Risotto",
      count: 8,
    },
  ];

  return (
    <React.Fragment>
      <Navbar />
      <section className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-4 m-4">
        <section className="flex flex-col items-center">
          <h1 className="text-7xl sm:text-8xl font-Lora_BoldItalic mb-4 text-[#172B25] text-center">Sizzle 'n Spice</h1>
          <img src="/sns.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112 saturate-100" />
          <div className="text-xl font-Lora_MediumItalic sm:text-2xl mt-4 text-[#172B25] text-center">Where Every Bite Sizzles With Flavours!</div>
        </section>
        <section className="py-8 sm:px-4 md:px-6">
          <section className="flex flex-col items-center">
            <h1 className="text-2xl lg:text-5xl font-Lora_SemiBold m-2 p-2 rounded-full gap-2 text-[#172B25]">
              <Image unoptimized src="/svg/door.gif" alt="door" width={200} height={200} className="object-cover w-14 h-14" />
              Order delicious foods and get them at your doorsteps{" "}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <a key={index} className="flex flex-col rounded-2xl shadow-md shadow-[#172B25] overflow-hidden transition-all duration-500 hover:scale-105 h-full">
                  <Image src={category.image} width={200} height={200} alt={category.title} className="object-cover w-full h-48" />
                  <div className="flex flex-col justify-between p-3 bg-[#172B25] flex-grow text-xs">
                    <h2 className="text-[#E6DFD4] truncate font-Lora_Medium">{category.title}</h2>
                    <p className="text-[#CAC4CE] mt-auto">{category.count} Items</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </section>
        <section className="flex items-center justify-center">
          <section className="flex flex-col max-w-7xl bg-[#172B25] p-8 rounded-2xl text-[#E6DFD4] shadow-md shadow-[#172B25]">
            <span className="flex items-center justify-center gap-2 text-xl font-Lora_BoldItalic xl:text-6xl">
              <ImLeaf size={80} className="animate-pulse text-[#FFF4E9]" /> Feast Your Senses with, Spices and Freshness
            </span>
            <div id="signin-form">
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const provider = formData.get("provider") as string;
                  await signIn(provider);
                }}
              >
                <section className="mb-4 github-signin">
                  <button
                    type="submit"
                    name="provider"
                    value="github"
                    className="w-full px-4 py-2 ttransition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center gap-2"
                  >
                    <VscGithubInverted size={20} /> Sign in with Github
                  </button>
                </section>

                <section className="google-signin">
                  <button
                    type="submit"
                    name="provider"
                    value="google"
                    className="w-full px-4 py-2 transition duration-700 ease-in-out transform rounded-full bg-[#FFF4E9] hover:bg-[#468353] text-[#172B25] hover:text-[#FFF4E9] flex items-center justify-center gap-2"
                  >
                    <AiFillGoogleCircle size={20} /> Sign in with Google
                  </button>
                </section>
              </form>
            </div>
          </section>
        </section>
      </section>
      <Footer />
    </React.Fragment>
  );
}
