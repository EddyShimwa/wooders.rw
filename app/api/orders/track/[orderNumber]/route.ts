import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';

// GET /api/orders/track/[orderNumber] - Track order by order number
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    await dbConnect();
    const { orderNumber } = await params;
    const order = await Order.findOne({ orderNumber });
    
    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Order not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: order 
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch order', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
