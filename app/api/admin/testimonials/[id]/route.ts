import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Testimonial } from '@/lib/db/models/Testimonial';
import { authenticateAdminRequest, AdminAuthError } from '@/lib/auth/adminAuth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authenticateAdminRequest(request);

    const { id } = await params;
    await dbConnect();

    const body = await request.json();
    const { status, name, feedback } = body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(name && { name }),
        ...(feedback && { feedback })
      },
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: {
        _id: testimonial._id,
        id: testimonial._id?.toString(),
        name: testimonial.name,
        email: testimonial.email,
        feedback: testimonial.feedback,
        photo: testimonial.photo,
        status: testimonial.status,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authenticateAdminRequest(request);

    const { id } = await params;
    await dbConnect();

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
