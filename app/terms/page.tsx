import React from "react";
import HeaderClient from "@/components/HeaderClient";

export const metadata = {
  title: "Terms of Service - Wooders",
};

export default function TermsPage() {
  return (
    <div className="min-h-[50vh] py-32">
      <HeaderClient />

      <main className="container mx-auto px-4 py-12 pt-20">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

        <p className="text-muted-foreground mb-4">
          These terms govern your use of Wooders. By using our site you agree to these terms.
        </p>

        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Use of the site</h2>
          <p className="text-muted-foreground">
            You may browse and place orders subject to availability. Prices and availability are
            subject to change.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Limitation of liability</h2>
          <p className="text-muted-foreground">Wooders is not liable for indirect or consequential damages.</p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">Contact</h2>
          <p className="text-muted-foreground">If you have questions about these terms, email info@woodersrwanda.rw</p>
        </section>
      </main>
    </div>
  );
}
