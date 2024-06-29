// app/admin/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      fetch("/api/admin")
        .then((res) => res.json())
        .then((data) => {
          if (data.isAdmin) router.push("/admin/profile");
          else router.push("/admin/register");
        });
    }
  }, [session, status, router]);
  if (status === "loading") return null;
  return null;
}
