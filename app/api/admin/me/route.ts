import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { AdminAuthError, authenticateAdminRequest } from '@/lib/auth/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const admin = await authenticateAdminRequest(request);

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id?.toString() ?? admin.id,
        email: admin.email,
        name: admin.name,
      },
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
        message: 'Failed to fetch admin profile',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
