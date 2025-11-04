# Testimonials System - Quick Start Guide

## 🚀 Quick Navigation

### For Customers
- **Submit Testimonial**: Click "Share Your Feedback" button on home page → `/testimonials`
- **QR Code**: Scan with phone to submit testimonial directly

### For Admin
- **Manage Testimonials**: `/admin/testimonials`
- **Generate QR Code**: `/admin/testimonials` → Click "QR Code" button → `/admin/qr-code`

---

## 📋 User Journey

### Customer Testimonial Submission

1. **Option A - Home Page Button**
   - Go to home page (/)
   - Scroll to "What Our Customers Say" section
   - Click "Share Your Feedback" button
   - Fill form in modal:
     - Name (required)
     - Email (required)
     - Feedback (required, min 10 chars)
     - Photo (optional, max 5MB)
   - Click "Submit Testimonial"
   - See success message

2. **Option B - Direct Link**
   - Go to `/testimonials`
   - Fill in same form (full page version)
   - Submit testimonial

3. **Option C - QR Code**
   - Scan QR code (admin generates this)
   - Mobile browser opens `/testimonials`
   - Fill in testimonial form
   - Submit

### Admin Workflow

1. **Login**
   - Go to `/admin/login`
   - Enter credentials

2. **View Testimonials**
   - Go to `/admin/testimonials` (or click from orders dashboard)
   - See stats: Total, Pending, Approved, Rejected
   - Filter by status using dropdown

3. **Manage Individual Testimonial**
   - Click 👁️ icon to view full details
   - Click ✓ (green) to approve
   - Click ✗ (red) to reject
   - Click 🗑️ (red) to delete

4. **Generate QR Code**
   - Click "QR Code" button (top right)
   - Download QR code image
   - Share on packaging, receipts, social media, etc.

---

## 🔧 Technical Details

### API Endpoints

**Public**
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit new testimonial

**Admin (Requires Auth)**
- `GET /api/admin/testimonials` - Get all/filtered testimonials
- `PUT /api/admin/testimonials/[id]` - Update testimonial (approve/reject/edit)
- `DELETE /api/admin/testimonials/[id]` - Delete testimonial

### Database
- Model: `Testimonial`
- Fields: name, email, feedback, photo, status, createdAt, updatedAt
- Status: pending | approved | rejected

### Frontend Routes
- `/` - Home page (shows approved testimonials carousel)
- `/testimonials` - Standalone testimonial form page
- `/admin/testimonials` - Testimonials management dashboard
- `/admin/qr-code` - QR code generator page

---

## 📁 File Structure

```
types/
  testimonial.ts                 # Types & interfaces
lib/
  db/models/
    Testimonial.ts              # MongoDB model
  api/
    testimonialService.ts        # API service functions
components/
  TestimonialForm.tsx            # Submission form
  TestimonialsCarousel.tsx       # Display carousel
  TestimonialModal.tsx           # Modal wrapper
  QRCodeGenerator.tsx            # QR code generator
app/
  testimonials/
    page.tsx                     # Testimonial form page
  admin/
    testimonials/
      page.tsx                   # Admin dashboard
    qr-code/
      page.tsx                   # QR code generator
  api/
    testimonials/
      route.ts                   # Public endpoints
    admin/
      testimonials/
        route.ts                 # Admin list endpoint
        [id]/route.ts            # Admin CRUD endpoints
```

---

## ✨ Features

✅ User testimonial submission with optional photo upload
✅ Admin approval workflow (pending → approved/rejected)
✅ Dynamic carousel display on home page
✅ QR code generation for easy customer engagement
✅ Full CRUD operations for admin
✅ Form validation with error messages
✅ Responsive design (mobile & desktop)
✅ Toast notifications for all actions
✅ Filtered admin views (pending, approved, rejected)
✅ Statistics dashboard
✅ Photo preview before submission

---

## 🔒 Security

- All admin endpoints require JWT authentication
- Input validation on frontend (Zod) and backend
- File upload validation (size, type)
- Base64 encoding for image storage
- CORS protection with credentials

---

## 🐛 Testing Checklist

- [ ] Submit testimonial from home page
- [ ] Submit testimonial from `/testimonials` page
- [ ] Upload and preview photo
- [ ] See testimonial in admin dashboard (pending)
- [ ] Approve testimonial from admin
- [ ] See approved testimonial on home page carousel
- [ ] Reject testimonial from admin
- [ ] Delete testimonial from admin
- [ ] Generate QR code and scan it
- [ ] Filter testimonials by status
- [ ] Verify form validation (empty fields, invalid email)
- [ ] Test photo size limit
- [ ] Check responsive design on mobile

---

## 💡 Tips for Admins

1. **Engagement Strategy**: Generate QR codes and include them in:
   - Product packaging
   - Delivery boxes
   - Receipts
   - Email follow-ups
   - Social media posts

2. **Best Practices**:
   - Review testimonials regularly (at least weekly)
   - Approve testimonials quickly to encourage participation
   - Delete spam or inappropriate content
   - Monitor pending count from dashboard stats

3. **Display on Website**:
   - Testimonials automatically appear on home page after approval
   - Only approved testimonials are public
   - Carousel shows up to 5 testimonials at a time

---

## ❓ FAQ

**Q: How many testimonials can I store?**
A: Unlimited - stored in MongoDB database

**Q: Can customers edit their testimonials?**
A: Currently no, but admin can edit or delete them

**Q: What image formats are supported?**
A: PNG, JPG, GIF (any image/* MIME type), max 5MB

**Q: How do I share the QR code?**
A: Download from `/admin/qr-code` page and print/share anywhere

**Q: When do testimonials appear on the home page?**
A: Only after admin approves them

**Q: Can I disable testimonials?**
A: Yes, just don't approve any or remove the section from home page

---

## 🆘 Troubleshooting

**Problem**: Can't see testimonials on home page
- Solution: Approve at least one testimonial in admin dashboard

**Problem**: Form submission fails
- Solution: Check console for errors, ensure all required fields filled

**Problem**: Photo won't upload
- Solution: Check file size (max 5MB) and file type (must be image)

**Problem**: QR code not generating
- Solution: Ensure internet connection, QR code uses external API

**Problem**: Can't access admin page
- Solution: Login to `/admin/login` first

---

## 📚 Documentation

For detailed documentation, see `TESTIMONIALS_SETUP.md`
