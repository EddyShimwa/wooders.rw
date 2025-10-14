import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { AdminAuthError, authenticateAdminRequest } from '@/lib/auth/adminAuth';
import { sendOrderStatusUpdateToCustomer } from '@/lib/email/notifications';

// PATCH /api/orders/[id]/status - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    await authenticateAdminRequest(request);
    const body = await request.json();
    const { status } = body;
    const { id } = await params;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Order not found' 
        },
        { status: 404 }
      );
    }
    
    // Send email notification to customer asynchronously
    sendOrderStatusUpdateToCustomer(order);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order status updated successfully', 
      data: order 
    });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update order status', 
        error: error.message 
      },
      { status: 400 }
    );
  }
}
