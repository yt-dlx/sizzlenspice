// app/admin/page.tsx
"use server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function checkAdminStatus(email: string) {}

export default async function Admin() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const isAdmin = await checkAdminStatus(session.user.email);
  if (isAdmin) redirect("/admin/auth/login");
  else redirect("/admin/auth/register");
}
