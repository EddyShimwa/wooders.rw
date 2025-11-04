import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Testimonial } from '@/lib/db/models/Testimonial';
import { authenticateAdminRequest, AdminAuthError } from '@/lib/auth/adminAuth';

// GET all testimonials (admin only) - with optional filtering by status
export async function GET(request: NextRequest) {
  try {
    await authenticateAdminRequest(request);

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = status ? { status } : {};

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      testimonials: testimonials.map(t => ({
        _id: t._id,
        id: t._id?.toString(),
        name: t.name,
        email: t.email,
        feedback: t.feedback,
        photo: t.photo,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      }))
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
