const WHATSAPP_NUMBER = '250780609878'

export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function getProductOrderLink(productName: string, categoryName?: string): string {
  const lines = [
    `Hi Wooders! I'm interested in ordering:`,
    ``,
    `*${productName}*`,
    categoryName ? `Category: ${categoryName}` : '',
    ``,
    `Could you please share more details?`,
  ].filter(Boolean)

  return getWhatsAppLink(lines.join('\n'))
}

export function getGeneralInquiryLink(): string {
  return getWhatsAppLink(
    `Hi Wooders! I'd like to learn more about your handcrafted wooden products.`
  )
}
