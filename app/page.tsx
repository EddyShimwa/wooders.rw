import { getCategories, getPaginatedProducts, getHero } from '@/lib/contentful'
import { getApprovedTestimonialsServer } from '@/lib/api/serverTestimonials'
import HomeClient from '@/components/HomeClient'
import { Category } from '@/types/category'

export const revalidate = 21600 

export default async function Home() {
  const [categories, productsRes, hero, testimonialsRes] = await Promise.all([
    getCategories(),
    getPaginatedProducts({ limit: 50 }), 
    getHero(),
    getApprovedTestimonialsServer({ limit: 20 })
  ])

  const products = productsRes.items;
  const testimonials = testimonialsRes.items;
  const categoriesWithProducts: Category[] = categories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id).length,
    products: products.filter((p) => p.categoryId === category.id),
  }))

  return (
    <HomeClient 
      initialCategories={categoriesWithProducts} 
      initialHero={hero} 
      initialTestimonials={testimonials}
    />
  )
}
