import { Testimonial } from '@/types/testimonial';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Public endpoints

export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    cache: 'no-store',
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch testimonials');
  }

  return result.testimonials as Testimonial[];
};

export const submitTestimonial = async (payload: {
  name: string;
  email: string;
  rating: number;
  feedback: string;
  photo?: string; 
}): Promise<Testimonial> => {
  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to submit testimonial');
  }

  return result.testimonial as Testimonial;
};

// Admin endpoints

export const getAllTestimonials = async (status?: string): Promise<Testimonial[]> => {
  const query = status ? `?status=${status}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/testimonials${query}`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch testimonials');
  }

  return result.testimonials as Testimonial[];
};

export const updateTestimonial = async (
  testimonialId: string,
  payload: { status?: string; name?: string; feedback?: string }
): Promise<Testimonial> => {
  const response = await fetch(`${API_BASE_URL}/admin/testimonials/${testimonialId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to update testimonial');
  }

  return result.testimonial as Testimonial;
};

export const approveTestimonial = async (testimonialId: string): Promise<Testimonial> => {
  return updateTestimonial(testimonialId, { status: 'approved' });
};

export const rejectTestimonial = async (testimonialId: string): Promise<Testimonial> => {
  return updateTestimonial(testimonialId, { status: 'rejected' });
};

export const deleteTestimonial = async (testimonialId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/testimonials/${testimonialId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to delete testimonial');
  }
};

// Utility function to convert image file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
