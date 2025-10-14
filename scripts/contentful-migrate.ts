import { config } from 'dotenv'
import contentful from 'contentful-management'

config({ path: '.env.local' })

async function run() {
  const mgmtToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN
  const spaceId = process.env.CONTENTFUL_SPACE_ID

  if (!mgmtToken || !spaceId) {
    console.error('Please set CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID in your environment')
    process.exit(1)
  }

  const client = contentful.createClient({ accessToken: mgmtToken })
  const space = await client.getSpace(spaceId)
  const environment = await space.getEnvironment('master')

  // Category content type
  const categoryFields = [
    { id: 'name', name: 'Name', type: 'Symbol', required: true },
    { id: 'slug', name: 'Slug', type: 'Symbol', required: true },
    { id: 'description', name: 'Description', type: 'Text' },
    { id: 'image', name: 'Image', type: 'Link', linkType: 'Asset' },
  ]

  // Product content type (updated to link to Category)
  const productFields = [
    { id: 'name', name: 'Name', type: 'Symbol', required: true },
    { id: 'slug', name: 'Slug', type: 'Symbol', required: true },
    { id: 'description', name: 'Description', type: 'Text' },
    { id: 'price', name: 'Price', type: 'Number', required: true },
    { id: 'image', name: 'Image', type: 'Link', linkType: 'Asset', required: true },
    { id: 'category', name: 'Category', type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['category'] }] },
    { id: 'available', name: 'Available', type: 'Boolean' },
    { id: 'sku', name: 'SKU', type: 'Symbol' },
  ]

  const heroFields = [
    { id: 'title', name: 'Title', type: 'Symbol' },
    { id: 'subtitle', name: 'Subtitle', type: 'Symbol' },
    { id: 'description', name: 'Description', type: 'Text' },
    { id: 'image', name: 'Image', type: 'Link', linkType: 'Asset' },
    { id: 'images', name: 'Images', type: 'Array', items: { type: 'Link', linkType: 'Asset' } },
  ]

  async function createOrUpdateContentType(id: string, name: string, fields: any[]) {
    try {
      const existing = await environment.getContentType(id).catch(() => null)
      if (existing) {
        existing.name = name
        existing.fields = fields
        const updated = await existing.update()
        await updated.publish()
        console.log(`Updated and published content type: ${id}`)
      } else {
        const created = await environment.createContentTypeWithId(id, {
          name,
          fields,
        })
        await created.publish()
        console.log(`Created and published content type: ${id}`)
      }
    } catch (err) {
      console.error(`Failed to create/update content type ${id}`, err)
    }
  }

  await createOrUpdateContentType('category', 'Category', categoryFields)
  await createOrUpdateContentType('product', 'Product', productFields)
  await createOrUpdateContentType('hero', 'Hero', heroFields)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
