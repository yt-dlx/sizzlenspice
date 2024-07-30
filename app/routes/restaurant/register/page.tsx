// app/routes/restaurant/register/page.tsx
"use client";
import Loading from "@/app/routes/loading";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ email: "", phoneNumber: "", name: "" });
  const handleInputChange = (field: string, value: string) => setUserData((prev) => ({ ...prev, [field]: value }));
  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; phoneNumber: string; name: string }) => {
      const response = await fetch("/api/restaurant/register", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onError: (error) => console.error("Failed to register user", error),
    onSuccess: () => router.push("/routes/restaurant/auth"),
    onSettled: () => setLoading(false),
  });
  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    registerMutation.mutate(userData);
  };
  if (loading) return <Loading />;
  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-secondary">Register</h1>
      </section>
      <section id="register" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-xl text-primary shadow-md shadow-secondary">
        <form onSubmit={handleRegister} className="space-y-1 flex flex-col text-xs py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-8">
            <div className="relative flex-grow">
              <input
                required
                readOnly
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow">
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={userData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="relative flex-grow">
              <input
                required
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-2 mt-4 text-lg transition duration-700 ease-in-out transform rounded-xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 border-2 border-secondary"
          >
            Register
          </button>
        </form>
      </section>
    </main>
  );
}
