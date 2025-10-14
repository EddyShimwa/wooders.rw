import { Order } from '@/lib/db/models/Order';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#f59e0b'; 
    case 'processing': return '#3b82f6'; 
    case 'shipped': return '#8b5cf6'; 
    case 'delivered': return '#10b981'; 
    case 'cancelled': return '#ef4444';
    default: return '#6b7280'; 
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'processing': return 'Processing';
    case 'shipped': return 'Shipped';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

export const generateOrderConfirmationEmail = (order: InstanceType<typeof Order>) => {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        $${(item.quantity * item.price).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Wooders Rwanda</h1>
          <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">New Order Received</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Order #${order.orderNumber}</h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Customer Information</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
          </div>

          <h3 style="margin: 30px 0 15px 0; color: #1f2937; font-size: 18px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background-color: #f9fafb;">
                <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: 600; color: #1f2937;">Total Amount:</td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: 700; color: #1f2937; font-size: 18px;">$${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">
              <strong>Action Required:</strong> Please process this order and update the status accordingly.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            This email was sent by Wooders Rwanda
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateOrderStatusUpdateEmail = (order: InstanceType<typeof Order>) => {
  const statusColor = getStatusColor(order.status);
  const statusText = getStatusText(order.status);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Wooders Rwanda</h1>
          <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">Order Status Update</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px; text-align: center;">
          <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Order #${order.orderNumber}</h2>
          <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px;">Status Update</p>

          <div style="background-color: #f3f4f6; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 12px 24px; background-color: ${statusColor}; color: #ffffff; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${statusText}
            </div>
          </div>

          <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Order Summary</h3>
            <p style="margin: 8px 0; color: #374151;"><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          ${order.status === 'shipped' ? `
            <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0; color: #065f46; font-weight: 500;">
                <strong>🚚 Your order has been shipped!</strong><br>
                Track your package using the order number above.
              </p>
            </div>
          ` : ''}

          ${order.status === 'delivered' ? `
            <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0; color: #065f46; font-weight: 500;">
                <strong>✅ Your order has been delivered!</strong><br>
                Thank you for shopping with Wooders Rwanda. We hope you enjoy your purchase!
              </p>
            </div>
          ` : ''}

          ${order.status === 'cancelled' ? `
            <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0; color: #991b1b; font-weight: 500;">
                <strong>Your order has been cancelled.</strong><br>
                If you have any questions, please contact our support team.
              </p>
            </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track?order=${order.orderNumber}"
               style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px;">
              Track Your Order
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
            Thank you for choosing Wooders Rwanda!
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This email was sent automatically by our order management system
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};