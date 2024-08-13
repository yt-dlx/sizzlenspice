"use client";
import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function FAQPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <h2>What is the return policy?</h2>
        <TypeAnimation
          sequence={["Our return policy allows you to return items within 30 days of purchase. Items must be in their original condition. Please contact our support team to initiate a return."]}
          wrapper="p"
          cursor={true}
          repeat={0}
        />
        <h2>How do I track my order?</h2>
        <p>You can track your order by logging into your account and visiting the "Orders" section. You will also receive a tracking link via email once your order has been shipped.</p>
        <h2>What payment methods do you accept?</h2>
        <p>We accept various payment methods, including credit/debit cards, PayPal, and other digital payment options. You can choose your preferred payment method at checkout.</p>
        <h2>How do I contact customer support?</h2>
        <p>You can reach our customer support team by emailing support@company.com or by calling our hotline at (123) 456-7890 during business hours.</p>
        <h2>Can I change my order after placing it?</h2>
        <p>If you need to change your order, please contact us as soon as possible. We can make changes to your order before it is shipped. Once it is shipped, changes cannot be made.</p>
      </div>
    </motion.div>
  );
}
