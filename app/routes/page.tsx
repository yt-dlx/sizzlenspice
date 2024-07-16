// app/routes/page.tsx
"use client";
import React from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaMapMarkerAlt, FaMapPin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function UserPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({ phoneNumber: "", customerEmail: "", locationData: { latitude: "", longitude: "", address: "", pincode: "" } });

  React.useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/user", { method: "GET", headers: { "Content-Type": "application/json" } });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData((prev) => ({ ...prev, phoneNumber: data.phoneNumber || "", customerEmail: data.customerEmail || session?.user?.email || "" }));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchUserData();
  }, [session]);

  const handleInputChange = (field: string, value: string) => setUserData((prev) => ({ ...prev, [field]: value }));
  const handleLocationChange = (field: string, value: string) => setUserData((prev) => ({ ...prev, locationData: { ...prev.locationData, [field]: value } }));

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update user data");
      router.push("/routes/customer/menu");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude.toString();
      const lon = position.coords.longitude.toString();
      handleLocationChange("latitude", lat);
      handleLocationChange("longitude", lon);
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          handleLocationChange("address", data.display_name || "");
          handleLocationChange("pincode", data.address.postcode || "");
        }
      }
    });
  }, []);

  if (loading) return <Loading />;
  if (error) throw new Error(error);

  // =======================================================================================================================================================================
  const Header = () => {};
  const UserData = () => {};
  // =======================================================================================================================================================================

  return (
    <main className="max-w-full mx-auto overflow-hidden bg-primary p-4">
      <section id="header" className="flex flex-col md:justify-center md:items-center sm:text-center text-secondary font-Playfair">
        <h1 className="text-7xl sm:text-9xl font-bold text-secondary">User Data</h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl py-2 font-Kurale">User data encompasses personal data collected to understand and improve user experiences!</h2>
        <img src="/svg/user.gif" className="mx-auto object-cover h-80 sm:h-96 lg:h-112 hue-rotate-180" />
      </section>
      <section id="UserData" className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto flex flex-col m-2 bg-secondary p-4 rounded-2xl text-primary">
        <form onSubmit={handleConfirm} className="space-y-1 flex flex-col text-xs font-Kurale font-bold py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-8">
            <div className="relative flex-grow">
              <FaMapMarkerAlt size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={userData.locationData.address}
                onChange={(e) => handleLocationChange("address", e.target.value)}
                placeholder="Fetching Address..."
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaMapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={userData.locationData.pincode}
                onChange={(e) => handleLocationChange("pincode", e.target.value)}
                placeholder="Fetching Pincode..."
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaEnvelope size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="email"
                value={userData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                placeholder="Email"
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="relative flex-grow">
              <FaPhone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="tel"
                value={userData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="Phone Number"
                className="w-full py-2 pl-10 pr-4 rounded-2xl bg-primary border-2 border-secondary shadow-md shadow-secondary text-secondary placeholder-secondary focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg transition duration-700 ease-in-out transform rounded-2xl bg-primary hover:bg-tertiary text-secondary flex items-center justify-center gap-2 font-Kurale font-bold"
          >
            Confirm and Continue
          </button>
        </form>
      </section>
    </main>
  );
}
