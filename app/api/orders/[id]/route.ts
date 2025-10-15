import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models/Order';
import { AdminAuthError, authenticateAdminRequest } from '@/lib/auth/adminAuth';

// DELETE /api/orders/[id] - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    await authenticateAdminRequest(request);
    const { id } = await params;
    const order = await Order.findByIdAndDelete(id);
    
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
      message: 'Order deleted successfully' 
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
        message: 'Failed to delete order', 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
