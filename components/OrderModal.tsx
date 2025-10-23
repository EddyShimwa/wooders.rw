'use client'

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { createOrder } from "@/lib/api/orderService";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const OrderModal = ({ isOpen, onClose, product }: OrderModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
  });
  const mutation = useMutation({
    mutationFn: createOrder,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    try {
      const order = await mutation.mutateAsync({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        items: [{
          productId: product.id.toString(),
          name: product.name,
          quantity: formData.quantity,
          price: product.price,
        }],
        totalAmount: product.price * formData.quantity,
      });
      
      toast.success(`Order placed successfully!`, {
        description: `Your order number is ${order.orderNumber}. We'll contact you soon to confirm your order.`,
      });

      setFormData({ name: "", email: "", phone: "", address: "", quantity: 1 });
      onClose();
    } catch (error) {
      toast.error("Failed to place order", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[500px] px-20">
  <DialogHeader>
          <DialogTitle>Order: {product.name}</DialogTitle>
          <DialogDescription>
            Fill in your details and we&apos;ll get back to you to complete your order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Order Summary</p>
              <p className="text-sm text-muted-foreground mt-1">{product.name}</p>
              <p className="text-sm text-muted-foreground">Quantity: {formData.quantity}</p>
              <p className="text-lg font-bold text-primary mt-2">RWF {(product.price * formData.quantity).toFixed(2)}</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-wood" disabled={mutation.isPending}>
              {mutation.isPending ? "Placing Order..." : "Place Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
