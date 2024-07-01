// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="sticky bottom-0 z-10 p-4 mt-auto shadow-md bg-[#111111]/30 backdrop-blur-md">
      <div className="flex items-center justify-between mx-auto max-w-full">
        <p className="text-sm text-[#E9F0CD] font-Kurale">Copyright © {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
