import { NextResponse } from 'next/server'
import { getHero } from '@/lib/contentful'

export async function GET() {
  try {
    const hero = await getHero()
    return NextResponse.json({ hero })
  } catch (err) {
    console.warn('Failed to fetch hero from Contentful; returning null hero', err)
    // Return 200 with null hero so the client can gracefully fallback
    return NextResponse.json({ hero: null })
  }
}
