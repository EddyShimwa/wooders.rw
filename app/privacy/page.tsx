import HeaderClient from "@/components/HeaderClient";
import React from "react";

export const metadata = {
  title: "Privacy Policy - Wooders",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[50vh] py-32">
      <HeaderClient />

      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <p className="text-muted-foreground mb-4">
          At Wooders, we respect your privacy. This page explains what information we collect
          and how we use it.
        </p>

        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Information we collect</h2>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Contact information you provide (email, phone).</li>
            <li>Order and shipping information.</li>
            <li>Usage data and analytics to improve our site.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">How we use your information</h2>
          <p className="text-muted-foreground">
            We use your information to process orders, communicate with you, and improve our
            services. We do not sell your personal data.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">Contact</h2>
          <p className="text-muted-foreground">If you have questions about our privacy policy, email woodersrwanda@gmail.com</p>
        </section>
      </main>
    </div>
  );
}
