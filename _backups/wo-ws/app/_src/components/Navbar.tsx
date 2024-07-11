// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 bg-[#1c3029]/30 backdrop-blur-md p-2 z-50">
      <div className="flex items-center justify-between mx-auto max-w-full">
        <Link href={"/"} className="text-xl font-bold cursor-pointer text-[#E9F0CD] font-Brittany">
          Sizzle 'n Spice
        </Link>
        <div className="flex items-center space-x-2">
          {session?.user?.image && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-auto h-auto shadow shadow-[#131313] rounded-full">
                  <img alt="User profile" src={session.user.image} />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-[#1c3029]/30 backdrop-blur-md rounded-box w-52 font-Kurale font-bold">
                <li>
                  <a className="text-[#E9F0CD] hover:bg-[#171717]/50">{session.user.name}</a>
                </li>
                <li>
                  <a href="/home/cart" className="text-[#E9F0CD] hover:bg-[#171717]/50">
                    My Orders
                  </a>
                </li>
                <li>
                  <a onClick={() => signOut()} className="text-[#E9F0CD] hover:bg-[#171717]/50">
                    Sign out
                  </a>
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