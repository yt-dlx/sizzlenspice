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
  if (session) redirect("/routes");
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
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Sizzle 'n Spice</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2">Where Every Bite Sizzles With Flavour and Love!</h2>
        <Image src="/sns.gif" alt="sns" width={300} height={300} className="mx-auto object-cover h-80 sm:h-96 lg:h-112" />
      </section>
      <section id="menu" className="flex flex-col items-center justify-center max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto py-4">
        <p className="text-2xl lg:text-5xl md:text-center gap-2 py-4 text-secondary">Order delicious foods and get them at your doorsteps </p>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category, index) => (
            <a href="#login" key={index} className="flex flex-col rounded-xl shadow-md shadow-secondary border-4 border-double border-secondary overflow-hidden h-full">
              <Image src={category.image} width={540} height={540} alt={category.title} className="object-cover w-full h-48" />
              <div className="text-primary flex flex-col justify-between rounded-b py-2 bg-secondary flex-grow text-center">
                <h2 className="truncate">{category.title}</h2>
                <p className="text-xs p-1">{category.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section id="login" className="max-w-2xl sm:max-w-4xl md:max-w-6xl text-secondary lg:max-w-7xl mx-auto">
        <form
          action={async (formData: FormData) => {
            "use server";
            const provider = formData.get("provider") as string;
            await signIn(provider);
          }}
        >
          <div className="gap-2 grid grid-cols-1 md:grid-cols-2 text-sm">
            <button
              type="submit"
              value="google"
              name="provider"
              className="w-full py-2 transition duration-700 ease-in-out transform rounded-xl bg-secondary hover:bg-secondary/80 text-primary flex items-center justify-center gap-2 shadow-md shadow-secondary"
            >
              <AiFillGoogleCircle size={20} />
              Google Log In
            </button>
            <button
              type="submit"
              value="github"
              name="provider"
              className="w-full py-2 transition duration-700 ease-in-out transform rounded-xl bg-secondary hover:bg-secondary/80 text-primary flex items-center justify-center gap-2 shadow-md shadow-secondary"
            >
              <VscGithubInverted size={20} />
              GitHub Log In
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
