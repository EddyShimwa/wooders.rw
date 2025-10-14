import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { AdminAuthError, authenticateAdminRequest } from '@/lib/auth/adminAuth';
import { sendOrderConfirmationToAdmin } from '@/lib/email/notifications';

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    await authenticateAdminRequest(request);
    const orders = await Order.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: orders 
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
        message: 'Failed to fetch orders', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const order = new Order(body);
    await order.save();
    
    // Send email notification to admin asynchronously
    sendOrderConfirmationToAdmin(order);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Order created successfully', 
        data: order 
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create order', 
        error: error.message 
      },
      { status: 400 }
    );
  }
}
