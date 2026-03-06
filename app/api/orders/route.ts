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
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch orders', 
        error: errorMessage 
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
    
    console.log('Creating order with data:', JSON.stringify(body, null, 2));
    
    const order = new Order(body);
    await order.save();
    
    console.log('Order created successfully:', order.orderNumber);
    
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
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create order', 
        error: errorMessage 
      },
      { status: 400 }
    );
  }
}
