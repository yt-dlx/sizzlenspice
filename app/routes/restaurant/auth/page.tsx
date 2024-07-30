// app/routes/restaurant/auth/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/app/routes/loading";

export default function AuthPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const checkUser = async () => {
      if (session) {
        const response = await fetch("/api/restaurant/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.exists) router.push("/routes/restaurant/profile");
          else router.push("/routes/restaurant/auth/register");
        } else console.error("Failed to check user");
      } else router.push("/api/auth/signin");
    };
    checkUser();
  }, [session, router]);
  return <Loading />;
}
