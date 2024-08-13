"use client";
import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function PrivacyPolicyPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="privacy-policy-container">
        <h1>Privacy Policy</h1>
        <TypeAnimation sequence={["Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information."]} wrapper="p" cursor={true} repeat={0} />
        <h2>Information We Collect</h2>
        <p>
          We collect information that you provide to us directly, such as when you create an account, make a purchase, or communicate with us. We also collect information automatically through your
          use of our services, such as your IP address and browsing behavior.
        </p>
        <h2>How We Use Your Information</h2>
        <p>We use your information to provide and improve our services, process transactions, communicate with you, and for other legitimate business purposes.</p>
        <h2>Sharing Your Information</h2>
        <p>
          We do not sell your personal information to third parties. We may share your information with trusted partners who assist us in providing our services, as well as when required by law or to
          protect our rights.
        </p>
        <h2>Your Choices</h2>
        <p>You have choices regarding your personal information, including the ability to access, update, or delete your information. You can also opt out of certain data collection practices.</p>
        <h2>Contact Us</h2>
        <p>If you have any questions or concerns about our privacy policy, please contact us at privacy@company.com.</p>
      </div>
    </motion.div>
  );
}
