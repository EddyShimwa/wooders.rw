const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
}

// Client API - Create order
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(orderData),
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to create order');
  }

  return result.data;
};

// Client API - Track order by order number
export const trackOrder = async (orderNumber: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders/track/${orderNumber}`, {
    credentials: 'include',
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to track order');
  }

  return result.data;
};

// Admin API - Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    credentials: 'include',
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch orders');
  }

  return result.data;
};

// Admin API - Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to update order status');
  }

  return result.data;
};

// Admin API - Delete order
export const deleteOrder = async (orderId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to delete order');
  }
};
