import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/contentful'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ products })
  } catch (err) {
    console.error('Failed to fetch products from Contentful', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
