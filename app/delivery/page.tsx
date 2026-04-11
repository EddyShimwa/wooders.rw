import React from "react";
import HeaderClient from "@/components/HeaderClient";

export const metadata = {
  title: "Delivery Information - Wooders",
};

export default function DeliveryPage() {
  return (
    <div className="min-h-[50vh] py-32">
      <HeaderClient />

      <main className="container mx-auto px-4 py-12 pt-20">
        <h1 className="text-3xl font-bold mb-4">Delivery Information</h1>

        <p className="text-muted-foreground mb-4">
          We deliver across Rwanda. Delivery time and cost depend on your location and order size.
        </p>
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Delivery time</h2>
          <p className="text-muted-foreground">Standard delivery takes 2-5 business days. For urgent orders, contact us on WhatsApp.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Contact</h2>
          <p className="text-muted-foreground">Email: woodersrwanda@gmail.com</p>
          <p className="text-muted-foreground">Phone: +250 780 609 878</p>
        </section>
      </main>
    </div>
  );
}
