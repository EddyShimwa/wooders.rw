'use client'

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { trackOrder, Order } from "@/lib/api/orderService";
import { toast } from "sonner";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export const OrderTrackingModal = ({ isOpen, onClose }: OrderTrackingModalProps) => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const trackMutation = useMutation<Order, Error, string>({
    mutationFn: trackOrder,
  });

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const trackedOrder = await trackMutation.mutateAsync(orderId);
      setOrder(trackedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track order");
      setOrder(null);
      toast.error("Order not found", {
        description: "Please check your order number and try again.",
      });
    }
  };

  const statusSteps = [
    { label: "Order Received", value: "pending", icon: Clock },
    { label: "Processing", value: "processing", icon: Package },
    { label: "Shipped", value: "shipped", icon: Truck },
    { label: "Delivered", value: "delivered", icon: CheckCircle },
  ];

  const getStepStatus = (stepValue: string) => {
    if (!order) return "upcoming";
    const currentIndex = statusSteps.findIndex((s) => s.value === order.status);
    const stepIndex = statusSteps.findIndex((s) => s.value === stepValue);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Track Your Order</DialogTitle>
          <DialogDescription>
            Enter your order ID to check the status of your order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              placeholder="ORD-1234567890"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-wood" disabled={trackMutation.isPending}>
            {trackMutation.isPending ? "Tracking..." : "Track Order"}
          </Button>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </form>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Order Details</h3>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Order Number:</span> {order.orderNumber}</p>
                <p><span className="font-medium">Customer:</span> {order.customerName}</p>
                <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                <p><span className="font-medium">Total:</span> ${order.totalAmount.toFixed(2)}</p>
                <p><span className="font-medium">Status:</span> <span className="capitalize">{order.status}</span></p>
              </div>
            </div>

            <h3 className="font-semibold text-lg">Order Progress</h3>
            
            {order.status === "cancelled" ? (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
                <XCircle className="h-6 w-6 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Order Cancelled</p>
                  <p className="text-sm text-muted-foreground">This order has been cancelled.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {statusSteps.map((step) => {
                  const status = getStepStatus(step.value);
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.value} className="flex items-start gap-4">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          status === "completed"
                            ? "bg-secondary text-secondary-foreground"
                            : status === "current"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            status === "upcoming" ? "text-muted-foreground" : ""
                          }`}
                        >
                          {step.label}
                        </p>
                        {status === "current" && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Your order is currently at this stage
                          </p>
                        )}
                      </div>
                      
                      {status === "completed" && (
                        <Check className="h-5 w-5 text-secondary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
