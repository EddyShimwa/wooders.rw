import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export default client;

export async function getProducts() {
  const entries = await client.getEntries({
    content_type: 'product',
  });

  return entries.items.map((item: any) => {
    const category = item.fields.category
    const categoryId = category?.sys?.id || null
    const categoryName = typeof category === 'string' ? category : (category?.fields?.name || '')

    return {
      id: item.sys.id,
      name: item.fields.name,
      slug: item.fields.slug || '',
      // Contentful description may be Rich Text. Convert to plain text for safe rendering.
      description: toPlainText(item.fields.description),
      price: item.fields.price,
      // Ensure asset URL is absolute (Contentful returns protocol-less URLs sometimes)
      image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : '',
      category: categoryName,
      categoryId,
    }
  });
}

export async function getCategories() {
  try {
    const entries = await client.getEntries({
      content_type: 'category',
    })

    return entries.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.name || '',
      slug: item.fields.slug || '',
      description: toPlainText(item.fields.description),
      image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : '',
    }))
  } catch (err: any) {
    console.warn('getCategories: failed to fetch categories from Contentful', err?.message || err)
    return []
  }
}

// Helper function to convert rich text to plain text
function toPlainText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.nodeType === 'text') return node.value || ''
  if (Array.isArray(node)) return node.map(toPlainText).join('')
  if (node.content) return node.content.map(toPlainText).join('')
  return ''
}

export async function getHero() {
  try {
    const entries = await client.getEntries({
      content_type: 'hero',
      limit: 1,
    })

    const item = entries.items[0]
    if (!item) return null

    const fields = item.fields || {}
    // Convert rich text to plain text when needed
    const description = toPlainText(fields.description)

    // Collect images: support fields.images (array of assets) or single fields.image
    const images: string[] = []
    if (Array.isArray(fields.images)) {
      for (const img of fields.images) {
        const url = (img as any)?.fields?.file?.url
        if (url) images.push(`https:${url}`)
      }
    }
    if ((fields.image as any)?.fields?.file?.url) {
      const single = `https:${(fields.image as any).fields.file.url}`
      if (!images.includes(single)) images.unshift(single)
    }

    return {
      title: fields.title || '',
      subtitle: fields.subtitle || '',
      description,
      images,
    }
  } catch (err: any) {
    // If the content type doesn't exist or another query error occurs, log and return null
    console.warn('getHero: failed to fetch hero from Contentful', err?.message || err)
    return null
  }
}