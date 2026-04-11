import { createClient, EntryFieldTypes, Asset, EntrySkeletonType } from 'contentful';
import { Product, PaginatedResponse } from '@/types/product';
import { Category } from '@/types/category';

function getClient() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!space || !token) {
    console.warn('Contentful env missing', { spacePresent: !!space, accessTokenPresent: !!token });
    return null;
  }

  return createClient({
    space,
    accessToken: token,
  });
}

export async function getProducts(): Promise<Product[]> {
  const res = await getPaginatedProducts({ limit: 100 });
  return res.items;
}

interface CategoryFields extends EntrySkeletonType {
  contentTypeId: 'category';
  fields: {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.RichText;
    image: EntryFieldTypes.AssetLink;
  }
}

interface ProductFields extends EntrySkeletonType {
  contentTypeId: 'product';
  fields: {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.RichText;
    price: EntryFieldTypes.Number;
    image: EntryFieldTypes.AssetLink;
    category: EntryFieldTypes.EntryLink<CategoryFields>;
  }
}

export async function getPaginatedProducts({ 
  limit = 12, 
  skip = 0, 
  categoryId,
  query: searchText
}: { 
  limit?: number; 
  skip?: number; 
  categoryId?: string;
  query?: string;
} = {}): Promise<PaginatedResponse<Product>> {
  const client = getClient();
  if (!client) return { items: [], total: 0, limit, skip };

  const query: Record<string, string | number | boolean | undefined> = {
    content_type: 'product',
    limit,
    skip,
    order: '-sys.createdAt',
  };

  if (categoryId) {
    query['fields.category.sys.id'] = categoryId;
  }

  if (searchText) {
    query.query = searchText;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries = await client.getEntries<ProductFields>(query as any);

  const items = entries.items.map((item) => {
    const fields = item.fields;
    const categoryEntry = fields.category as unknown as { sys: { id: string }; fields: { name: string } } | undefined;
    
    const itemCategoryId = categoryEntry?.sys?.id;
    const categoryName = categoryEntry?.fields?.name || '';

    const imageAsset = fields.image as unknown as Asset | undefined;
    const imageUrl = imageAsset?.fields?.file?.url ? `https:${imageAsset.fields.file.url}` : '';

    return {
      id: item.sys.id,
      name: (fields.name as unknown as string) || '',
      slug: (fields.slug as unknown as string) || '',
      description: toPlainText(fields.description),
      price: (fields.price as unknown as number) || 0,
      image: imageUrl,
      category: categoryName,
      categoryId: itemCategoryId,
    }
  });

  return {
    items,
    total: entries.total,
    limit,
    skip,
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const client = getClient();
    if (!client) return [];

    const entries = await client.getEntries<CategoryFields>({
      content_type: 'category',
    })

    return entries.items.map((item) => {
      const fields = item.fields;
      const imageAsset = fields.image as unknown as Asset | undefined;
      const imageUrl = imageAsset?.fields?.file?.url ? `https:${imageAsset.fields.file.url}` : '';

      return ({
        id: item.sys.id,
        name: (fields.name as unknown as string) || '',
        slug: (fields.slug as unknown as string) || '',
        description: toPlainText(fields.description),
        image: imageUrl,
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
    const client = getClient();
    if (!client) return null;

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
