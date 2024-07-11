// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="footer footer-center bg-[#131313] text-[#E9F0CD] p-10">
      <aside>
        <p className="font-Brittany text-4xl font-bold">Sizzle 'n Spice</p>
        <p className="font-Kurale m-2">Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
    </footer>
  );
};
export default Footer;
