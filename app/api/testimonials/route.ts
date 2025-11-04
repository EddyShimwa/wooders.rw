import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Testimonial } from '@/lib/db/models/Testimonial';

export async function GET() {
  try {
    await dbConnect();

    const testimonials = await Testimonial.find({ status: 'approved' })
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
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, feedback, rating, photo } = body;
    if (!name || !email || !feedback || !rating) {
      return NextResponse.json(
        { success: false, message: 'Name, email, feedback, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.create({
      name,
      email,
      feedback,
      rating,
      photo: photo || undefined, 
      status: 'pending'
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Testimonial submitted successfully',
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}
