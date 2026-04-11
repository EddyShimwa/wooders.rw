import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedProducts } from '@/lib/contentful'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = parseInt(searchParams.get('skip') || '0')
    const categoryId = searchParams.get('categoryId') || undefined
    const query = searchParams.get('query') || undefined

    const result = await getPaginatedProducts({ limit, skip, categoryId, query })
    return NextResponse.json(result)
  } catch (err) {
    console.error('Failed to fetch products from Contentful', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
