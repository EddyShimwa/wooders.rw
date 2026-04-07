import dbConnect from '@/lib/db/mongodb';
import { Testimonial as TestimonialModel } from '@/lib/db/models/Testimonial';
import { Testimonial } from '@/types/testimonial';
import { PaginatedResponse } from '@/types/product';

export async function getApprovedTestimonialsServer({ 
  limit = 10, 
  skip = 0 
}: { 
  limit?: number; 
  skip?: number; 
} = {}): Promise<PaginatedResponse<Testimonial>> {
  try {
    await dbConnect();

    const total = await TestimonialModel.countDocuments({ status: 'approved' });
    const testimonials = await TestimonialModel.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const items = testimonials.map(t => ({
      _id: t._id?.toString(),
      id: t._id?.toString(),
      name: t.name || 'Anonymous',
      email: t.email,
      feedback: t.feedback,
      rating: t.rating,
      photo: t.photo,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    })) as unknown as Testimonial[];

    return {
      items,
      total,
      limit,
      skip,
    };
  } catch (error) {
    console.error('Error fetching testimonials server-side:', error);
    return { items: [], total: 0, limit, skip };
  }
}
