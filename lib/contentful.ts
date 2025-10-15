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

  return entries.items.map((item) => {
    const fields = item.fields as {
      name?: string;
      slug?: string;
      description?: unknown;
      price?: number;
      image?: { fields?: { file?: { url?: string } } };
      category?: string | { sys?: { id?: string }; fields?: { name?: string } };
    };
    const category = fields.category;
    const categoryId = category && typeof category === 'object' && category.sys?.id ? category.sys.id : null;
    const categoryName = typeof category === 'string' ? category : (category && typeof category === 'object' && category.fields?.name ? category.fields.name : '');

    return {
      id: item.sys.id,
      name: fields.name || '',
      slug: fields.slug || '',
      // Contentful description may be Rich Text. Convert to plain text for safe rendering.
      description: toPlainText(fields.description),
      price: fields.price || 0,
      // Ensure asset URL is absolute (Contentful returns protocol-less URLs sometimes)
      image: fields.image?.fields?.file?.url ? `https:${fields.image.fields.file.url}` : '',
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

    return entries.items.map((item) => {
      const fields = item.fields as {
        name?: string;
        slug?: string;
        description?: unknown;
        image?: { fields?: { file?: { url?: string } } };
      };
      return ({
        id: item.sys.id,
        name: fields.name || '',
        slug: fields.slug || '',
        description: toPlainText(fields.description),
        image: fields.image?.fields?.file?.url ? `https:${fields.image.fields.file.url}` : '',
      });
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.warn('getCategories: failed to fetch categories from Contentful', errorMessage)
    return []
  }
}

// Helper function to convert rich text to plain text
function toPlainText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'object' && node !== null && 'nodeType' in node && typeof (node as { nodeType?: unknown }).nodeType === 'string' && (node as { nodeType: string }).nodeType === 'text') {
    return (node as { value?: string }).value || ''
  }
  if (Array.isArray(node)) return node.map(toPlainText).join('')
  if (typeof node === 'object' && node !== null && 'content' in node && Array.isArray((node as { content?: unknown }).content)) {
    return (node as { content: unknown[] }).content.map(toPlainText).join('')
  }
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

    const fields = item.fields as {
      title?: string;
      subtitle?: string;
      description?: unknown;
      images?: { fields?: { file?: { url?: string } } }[];
      image?: { fields?: { file?: { url?: string } } };
    };
    // Convert rich text to plain text when needed
    const description = toPlainText(fields.description)

    // Collect images: support fields.images (array of assets) or single fields.image
    const images: string[] = []
    if (Array.isArray(fields.images)) {
      for (const img of fields.images) {
        const url = img?.fields?.file?.url
        if (url) images.push(`https:${url}`)
      }
    }
    if (fields.image?.fields?.file?.url) {
      const single = `https:${fields.image.fields.file.url}`
      if (!images.includes(single)) images.unshift(single)
    }

    return {
      title: fields.title || '',
      subtitle: fields.subtitle || '',
      description,
      images,
    }
  } catch (err: unknown) {
    // If the content type doesn't exist or another query error occurs, log and return null
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.warn('getHero: failed to fetch hero from Contentful', errorMessage)
    return null
  }
}