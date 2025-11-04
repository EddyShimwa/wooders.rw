import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  email: string;
  feedback: string;
  rating: number;
  photo?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    photo: { type: String }, 
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

testimonialSchema.index({ status: 1, createdAt: -1 });
export const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
