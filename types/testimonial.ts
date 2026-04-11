export interface Testimonial {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  feedback: string;
  rating: number; 
  product?: string;
  photo?: string; 
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
