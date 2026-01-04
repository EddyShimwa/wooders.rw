import React from "react";
import HeaderClient from "@/components/HeaderClient";

export const metadata = {
  title: "Shipping Info - Wooders",
};

export default function DeliveryPage() {
  return (
    <div className="min-h-[50vh] py-32">
      <HeaderClient />

      <main className="container mx-auto px-4 py-12 pt-20">
        <h1 className="text-3xl font-bold mb-4">Shipping Information</h1>

        <p className="text-muted-foreground mb-4">
          We deliver across Rwanda. Delivery times and fees depend on your location and the
          items in your order.
        </p>
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Delivery times</h2>
          <p className="text-muted-foreground">Standard delivery: 2-5 business days. Express options available at checkout.</p>
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
