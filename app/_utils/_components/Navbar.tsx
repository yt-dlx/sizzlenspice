// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data } = useSession();

  return (
    <nav className="sticky top-0 z-10 navbar bg-[#172B25]/80 backdrop-blur-xl text-[#FFF4E9]">
      <div className="navbar-start">
        <div className="flex-1">
          |
          <Link href="/" className="btn btn-ghost text-xl font-Brittany_Signature">
            Sizzle 'n Spice
          </Link>
          |
        </div>
      </div>
      <div className="navbar-end">
        {data?.user?.image && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="indicator">
                <img alt="User profile" src={data.user.image} className="rounded-full border-2 border-[#172B25]" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-[#172B25]/80 backdrop-blur-xl rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <Link href="/">{data.user.name}</Link>
              </li>
              <li>
                <Link href="/cart/checkout">My Order</Link>
              </li>
              <li>
                <a onClick={() => signOut()}>Sign out</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
