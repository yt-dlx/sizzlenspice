// app/admin/page.tsx
"use server";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function getHostUrl() {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

async function checkAdminStatus(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${getHostUrl()}/api/admin?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return !!data.isAdmin;
  } catch (error) {
    return false;
  }
}

export default async function Admin() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");
  const isAdmin = await checkAdminStatus(session.user.email);
  if (isAdmin) redirect("/admin/auth/login");
  else redirect("/admin/auth/register");
}
