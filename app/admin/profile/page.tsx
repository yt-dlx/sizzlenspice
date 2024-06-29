// app/admin/profile/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/utils/components/Navbar";
import Footer from "@/app/utils/components/Footer";

export default function AdminProfile() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (!session) router.push("/");
        fetch("/api/admin")
            .then((res) => res.json())
            .then((data) => {
                if (!data.isAdmin) router.push("/");
                else setProfile(data.adminUser);
            });
    }, [session, status, router]);
    if (status === "loading") return null;

    return (
        <React.Fragment>
            <Navbar />
            <div className="mx-auto overflow-hidden bg-[#FFF4E9] max-w-6xl p-2">
                <div className="flex flex-col mb-4 m-4 md:justify-center md:items-center">
                    <h1 className="text-6xl sm:text-8xl font-Hatton_Bold font-bold text-[#172B25]">Restaurant Partner</h1>
                    <div className="flex flex-col my-10 items-center justify-center text-center">
                        {profile && profile.image && <img src={profile.image} alt={`${profile.name}'s profile`} className="rounded-3xl mb-2" />}
                        <ul className="text-lg text-[#172B25]">
                            <li>
                                Username: <span className="font-semibold">{profile?.name}</span>
                            </li>
                            <li>
                                Restaurant: <span className="font-semibold">{profile?.partner}</span>
                            </li>
                            <li>
                                Email: <span className="font-semibold">{profile?.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
