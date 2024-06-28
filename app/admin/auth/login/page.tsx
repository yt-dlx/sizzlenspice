// app/admin/auth/login/page.tsx
"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("admin-credentials", {
      phone,
      password,
      redirect: false,
    });
    if (result?.error) {
    } else {
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
