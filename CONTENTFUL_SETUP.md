# Contentful Setup Guide for Wooders

This guide will walk you through setting up your Contentful space for the Wooders wooden products website.

## Prerequisites

1. A Contentful account (sign up at https://www.contentful.com/)
2. A space created in Contentful
3. Your Contentful Space ID and API tokens

## Step 1: Get Your Contentful Credentials

### Content Delivery API Token (CDA)
1. Go to **Settings → API keys** in your Contentful space
2. Click **Add API key**
3. Give it a name (e.g., "Wooders Production")
4. Copy the **Space ID** and **Content Delivery API - access token**

### Content Management API Token (CMA) - For Migration
1. Go to **Settings → API keys → Content management tokens**
2. Click **Generate personal access token**
3. Give it a name and copy the token

### Add to `.env.local`

```env
# Content Delivery API (for fetching content in production)
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_cda_token_here

# Content Management API (for running migrations)
CONTENTFUL_MANAGEMENT_TOKEN=your_cma_token_here
```

## Step 2: Run the Migration Script

This will automatically create all content models (Category, Product, Hero) in your Contentful space.

```powershell
npm run migrate:contentful
```

You should see:
```
Created and published content type: category
Created and published content type: product
Created and published content type: hero
Migration complete
```

## Step 3: Create Categories

1. Go to **Content** in Contentful
2. Click **Add entry → Category**
3. Fill in the fields:
   - **Name**: e.g., "Wooden Mirrors"
   - **Slug**: e.g., "wooden-mirrors" (URL-friendly version)
   - **Description**: e.g., "Handcrafted mirrors with natural wood frames"
   - **Image**: Upload a category image (recommended: 1200x900px)
4. Click **Publish**

**Recommended Categories:**
- Wooden Mirrors
- Wooden Shelves
- Wooden Clocks
- Key Hangers
- Picture Frames
- Wall Décor
- Coffee Tables

## Step 4: Create Products

1. Go to **Content** in Contentful
2. Click **Add entry → Product**
3. Fill in the fields:
   - **Name**: Product name (e.g., "Live Edge Mirror")
   - **Slug**: URL-friendly name (e.g., "live-edge-mirror")
   - **Description**: Product description (can be rich text or plain text)
   - **Price**: Product price in dollars (e.g., 120)
   - **Image**: Upload product image (recommended: 1000x1000px square)
   - **Category**: Click and select a Category entry you created
   - **Available**: Check if product is in stock
   - **SKU**: Optional product SKU
4. Click **Publish**

**Repeat** for all your products, making sure each one is linked to a category.

## Step 5: Create Hero Content (Optional)

1. Go to **Content** in Contentful
2. Click **Add entry → Hero**
3. Fill in the fields:
   - **Title**: e.g., "Crafted with Nature"
   - **Subtitle**: e.g., "Handcrafted wooden furniture and décor"
   - **Description**: Short description for the hero section
   - **Image**: Single hero image (optional, for backwards compatibility)
   - **Images**: Multiple images for carousel (recommended: 1200x1200px)
4. Click **Publish**

**Note**: Only create ONE hero entry. The app will use the first one it finds.

## Step 6: Verify Your Setup

1. Restart your development server:
   ```powershell
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. You should see:
   - Your hero content at the top
   - Category cards displayed in a grid
   - When you click a category, a modal opens showing products in that category

## Content Structure Overview

```
Contentful Space
├── Categories (e.g., Wooden Mirrors, Shelves, Clocks)
│   ├── Name
│   ├── Slug
│   ├── Description
│   └── Image
│
├── Products (linked to Categories)
│   ├── Name
│   ├── Slug
│   ├── Description
│   ├── Price
│   ├── Image
│   ├── Category (Reference to Category)
│   ├── Available (Boolean)
│   └── SKU
│
└── Hero (single entry)
    ├── Title
    ├── Subtitle
    ├── Description
    ├── Image (optional single image)
    └── Images (array of images for carousel)
```

## Tips for Best Results

### Images
- **Category images**: 1200x900px (4:3 ratio)
- **Product images**: 1000x1000px (1:1 square ratio)
- **Hero images**: 1200x1200px (1:1 square ratio)
- Use high-quality JPGs or PNGs
- Keep file sizes under 500KB for fast loading

### Descriptions
- You can use **Rich Text** for descriptions (bold, italics, lists)
- The app will automatically convert Rich Text to plain text for display
- Keep product descriptions concise (2-3 sentences)

### Categories
- Create 5-10 categories to start
- Add 3-5 products per category minimum
- Use descriptive names that customers will recognize

### Products
- Always link products to a category using the **Category** reference field
- Set **Available** to `true` for products in stock
- Use clear, descriptive product names

## Troubleshooting

### "Failed to fetch categories" error
- Check that `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` are set in `.env.local`
- Restart your dev server after changing environment variables
- Verify that you've published your content in Contentful (not just saved drafts)

### Categories showing but no products
- Make sure products are **linked** to categories via the Category reference field
- Check that products are published in Contentful
- Verify products have all required fields filled in

### Hero images not showing
- Make sure you've uploaded images to the **Images** field (array)
- Check that the hero entry is published
- Images should be in the **Images** array, not just the single **Image** field

## Need Help?

Check the Contentful documentation:
- Content Model: https://www.contentful.com/developers/docs/concepts/data-model/
- Content Management API: https://www.contentful.com/developers/docs/references/content-management-api/

Your Wooders app is now connected to Contentful! 🎉
