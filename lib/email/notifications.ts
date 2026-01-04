import { sendEmail } from './emailService';
import { generateOrderConfirmationEmail, generateOrderStatusUpdateEmail } from './templates';

export const sendOrderConfirmationToAdmin = async (order: InstanceType<typeof import('@/lib/db/models/Order').Order>) => {
  try {
    const adminEmail = process.env.BREVO_ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('BREVO_ADMIN_EMAIL not configured; skipping admin notification');
      return;
    }
    const htmlContent = generateOrderConfirmationEmail(order);

    await sendEmail({
      to: [{ email: adminEmail, name: 'Wooders Rwanda Admin' }],
      subject: `New Order Received - #${order.orderNumber}`,
      htmlContent,
    });

    console.log(`Order confirmation email sent to admin for order ${order.orderNumber}`);
  } catch (error) {
    console.error('Failed to send order confirmation email to admin:', error);
  }
};

export const sendOrderStatusUpdateToCustomer = async (order: InstanceType<typeof import('@/lib/db/models/Order').Order>) => {
  try {
    const htmlContent = generateOrderStatusUpdateEmail(order);

    await sendEmail({
      to: [{ email: order.customerEmail, name: order.customerName }],
      subject: `Order Status Update - #${order.orderNumber}`,
      htmlContent,
    });

    console.log(`Order status update email sent to customer for order ${order.orderNumber}`);
  } catch (error) {
    console.error('Failed to send order status update email to customer:', error);
    // Don't throw error to avoid breaking status update
  }
};