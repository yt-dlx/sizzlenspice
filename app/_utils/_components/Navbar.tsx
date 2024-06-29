// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data } = useSession();

  return (
    <nav className="sticky top-0 bg-[#FFF4E9]/60 backdrop-blur-lg border-b border-[#172B25]/10 p-4 z-10">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <Link href={"/"} className="text-xl font-Brittany_Signature cursor-pointer text-[#172B25]">
          Sizzle 'n Spice
        </Link>
        <div className="flex items-center space-x-2">
          {data?.user?.image && (
            <div className="flex items-center space-x-2 dropdown dropdown-end">
              <span className="text-[#172B25]">{data.user.name}</span>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="User profile" src={data.user.image} />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content border-2 border-[#172B25] bg-[#FFF4E9]/60 backdrop-blur-lg rounded-3xl w-52">
                <li>
                  <a onClick={() => signOut()} className="text-[#172B25] hover:bg-[#172B25]/10">
                    Sign out
                  </a>
                </li>
                <li>
                  <Link href="/cart/checkout">My Order</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
