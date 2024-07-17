// app/_assets/components/Footer.tsx
"use client";
const Footer = () => {
  return (
    <footer className="footer footer-center bg-primary text-secondary p-10">
      <aside>
        <p className="font-Brittany text-4xl font-bold">Sizzle 'n Spice</p>
        <p className="font-Kurale m-2">Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
    </footer>
  );
};
export default Footer;
