import { NextResponse } from 'next/server'
import { getCategories, getProducts } from '@/lib/contentful'

export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ])

    // Count products per category
    const categoriesWithCounts = categories.map((category) => ({
      ...category,
      productCount: products.filter((p) => p.categoryId === category.id).length,
      products: products.filter((p) => p.categoryId === category.id),
    }))

    return NextResponse.json({ categories: categoriesWithCounts })
  } catch (err) {
    console.error('Failed to fetch categories from Contentful', err)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
