export interface Testimonial {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  feedback: string;
  rating: number; // 1-5 stars
  photo?: string; // Base64 or URL
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestimonialFormData {
  name: string;
  email: string;
  feedback: string;
  rating: number;
  photo?: File | null;
}
