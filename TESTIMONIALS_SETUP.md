# Testimonials System Documentation

## Overview

The Testimonials System is a comprehensive feature for collecting, managing, and displaying customer testimonials on your Wooders website. It includes:

- **User-facing testimonial submission form** accessible from the home page or via QR code
- **Admin dashboard** for managing testimonials with approve/reject/delete functionality
- **Public testimonials display** as a carousel on the home page
- **QR code generation** for easy sharing with customers

## Features

### User Side (Home Page & Testimonials Page)

1. **Testimonial Submission Form**
   - Collect customer name, email, and feedback
   - Optional photo upload (max 5MB)
   - Form validation with user-friendly error messages
   - Accessible via:
     - "Share Your Feedback" button on home page
     - Direct link: `/testimonials`
     - QR code scan (generated in admin dashboard)

2. **Testimonials Carousel**
   - Display approved testimonials with star ratings
   - Shows customer photo, name, feedback, and submission date
   - Carousel navigation with previous/next buttons
   - Appears on home page only when testimonials exist

### Admin Side (Admin Dashboard)

1. **Testimonials Management Page** (`/admin/testimonials`)
   - View all testimonials with filtering options:
     - All testimonials
     - Pending review
     - Approved
     - Rejected
   - Quick stats showing total, pending, approved, and rejected counts
   - Actions for each testimonial:
     - View full details in a modal
     - Approve testimonial
     - Reject testimonial
     - Delete testimonial
   - Refresh button to reload testimonials

2. **QR Code Generator** (`/admin/qr-code`)
   - Generate QR code linking to testimonial submission form
   - Download QR code as PNG image
   - Instructions for sharing (packaging, receipts, social media, email, website)

## Technical Implementation

### Database Models

**Testimonial Model** (`lib/db/models/Testimonial.ts`)
- `name`: String (required) - Customer name
- `email`: String (required) - Customer email
- `feedback`: String (required) - Testimonial text
- `photo`: String (optional) - Base64 encoded image
- `status`: String (enum: 'pending', 'approved', 'rejected') - Default: 'pending'
- `createdAt`: Date - Automatically set
- `updatedAt`: Date - Automatically updated

### API Endpoints

#### Public Endpoints

- **GET `/api/testimonials`** - Fetch all approved testimonials
  - Returns: Array of testimonials with status 'approved'
  - Caching: 5 minute cache on frontend

- **POST `/api/testimonials`** - Submit a new testimonial
  - Body: `{ name, email, feedback, photo? }`
  - Returns: Created testimonial with 'pending' status

#### Admin Endpoints (Requires Authentication)

- **GET `/api/admin/testimonials`** - Fetch testimonials (with optional filtering)
  - Query params: `status` (optional: 'pending', 'approved', 'rejected')
  - Returns: Array of testimonials matching filter

- **PUT `/api/admin/testimonials/[id]`** - Update testimonial
  - Body: `{ status?, name?, feedback? }`
  - Returns: Updated testimonial

- **DELETE `/api/admin/testimonials/[id]`** - Delete testimonial
  - Returns: Success message

### Frontend Components

1. **TestimonialForm** (`components/TestimonialForm.tsx`)
   - Reusable form for submitting testimonials
   - Form validation with Zod
   - File upload with preview
   - Toast notifications

2. **TestimonialsCarousel** (`components/TestimonialsCarousel.tsx`)
   - Display testimonials in carousel format
   - Star rating display
   - Avatar images
   - Responsive design

3. **TestimonialModal** (`components/TestimonialModal.tsx`)
   - Modal wrapper around TestimonialForm
   - Used on home page for quick submission

4. **QRCodeGenerator** (`components/QRCodeGenerator.tsx`)
   - Generate QR codes using QR Server API
   - Download functionality
   - No external dependencies required

### Service Layer

**lib/api/testimonialService.ts** provides:
- `getApprovedTestimonials()` - Public: Fetch approved testimonials
- `submitTestimonial()` - Public: Submit new testimonial
- `getAllTestimonials()` - Admin: Fetch with optional filter
- `updateTestimonial()` - Admin: Update testimonial
- `approveTestimonial()` - Admin: Approve testimonial
- `rejectTestimonial()` - Admin: Reject testimonial
- `deleteTestimonial()` - Admin: Delete testimonial
- `fileToBase64()` - Utility: Convert image file to base64

### Types

**types/testimonial.ts** defines:
- `Testimonial` - Main testimonial interface
- `TestimonialFormData` - Form submission data

## Workflow

### Submitting a Testimonial

1. User clicks "Share Your Feedback" button on home page or scans QR code
2. Testimonial form opens (either modal on home page or full page at `/testimonials`)
3. User fills in name, email, feedback, and optionally uploads a photo
4. Form validates input and shows error messages if needed
5. On submit, testimonial is sent to backend with status 'pending'
6. User sees success message
7. Testimonial is stored in database

### Approving Testimonials

1. Admin logs in and navigates to `/admin/testimonials`
2. Admin sees pending testimonials in the table
3. Admin can:
   - View full testimonial details in a modal
   - Click ✓ (green) to approve
   - Click ✗ (red) to reject
   - Click trash icon to delete
4. Approved testimonials appear on the home page
5. Toast notification confirms action

## Files Created/Modified

### New Files Created
- `types/testimonial.ts` - Types and interfaces
- `lib/db/models/Testimonial.ts` - MongoDB model
- `lib/api/testimonialService.ts` - API service functions
- `components/TestimonialForm.tsx` - Submission form
- `components/TestimonialsCarousel.tsx` - Display carousel
- `components/TestimonialModal.tsx` - Modal wrapper
- `components/QRCodeGenerator.tsx` - QR code generator
- `app/api/testimonials/route.ts` - Public API endpoints
- `app/api/admin/testimonials/route.ts` - Admin list endpoint
- `app/api/admin/testimonials/[id]/route.ts` - Admin CRUD endpoints
- `app/testimonials/page.tsx` - Testimonial submission page
- `app/admin/testimonials/page.tsx` - Admin testimonials dashboard
- `app/admin/qr-code/page.tsx` - QR code generation page

### Modified Files
- `app/page.tsx` - Added testimonials section and submission button

## Security Considerations

1. **Admin Authentication**: All admin endpoints require valid JWT token
2. **CORS**: Admin endpoints use credentials: 'include'
3. **Input Validation**: All form inputs validated on frontend with Zod
4. **File Size Limits**: Photos limited to 5MB
5. **File Type Validation**: Only image files accepted for photos

## Performance Optimizations

1. **Database Indexes**: Status field indexed for faster queries
2. **Query Caching**: Frontend caches testimonials for 5 minutes
3. **Base64 Encoding**: Photos stored as base64 for easy retrieval
4. **Lean Queries**: MongoDB queries use lean() for better performance

## Future Enhancements

- Rating system (currently showing 5 stars for all)
- Testimonial pagination
- Search and sort testimonials
- Email notifications for new testimonials
- Testimonial scheduling
- Multiple photo uploads per testimonial
- Video testimonials support
- Integration with review platforms (Google, TripAdvisor)
- Testimonial analytics and reporting

## Troubleshooting

### Testimonials not showing on home page
- Check if testimonials exist and are approved
- Verify database connection
- Check browser console for API errors

### QR code not generating
- Ensure internet connection (uses QR Server API)
- Check if URL is being passed correctly
- Verify NEXT_PUBLIC_API_URL environment variable

### Admin can't access testimonials page
- Verify admin is logged in
- Check JWT token in cookies
- Ensure admin_token cookie exists

### Photo upload failing
- Check file size (max 5MB)
- Verify file is an image
- Check browser console for errors

## Environment Variables

No additional environment variables required for testimonials system.
Uses existing `NEXT_PUBLIC_API_URL` and `JWT_SECRET` from main app configuration.

## Usage Example

### Home Page Integration
```tsx
// Already integrated in app/page.tsx
<TestimonialsCarousel testimonials={testimonialsData} />
<Button onClick={() => setIsTestimonialModalOpen(true)}>
  Share Your Feedback
</Button>
```

### Admin Dashboard
```
Navigate to: /admin/testimonials
- View pending testimonials
- Approve/reject testimonials
- Delete testimonials
- Generate and download QR code
```

### Customer Testimonial Submission
```
Navigate to: /testimonials
or
Scan QR code from /admin/qr-code
- Fill in feedback form
- Upload optional photo
- Submit testimonial
```
