// components/Footer.tsx
"use client";
const Footer = () => {
  return (
    <footer className="footer footer-center text-[#0b1412] p-10">
      <aside>
        <p className="font-Lora_BoldItalic text-4xl">Sizzle 'n Spice</p>
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
