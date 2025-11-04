'use client'

import Image from 'next/image'

interface QRCodeGeneratorProps {
  url: string
  size?: number
}

export function QRCodeGenerator({
  url,
  size = 256,
}: QRCodeGeneratorProps) {
  // Use QR Code API service - no external library needed
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'testimonial-qr-code.png'
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="border-4 border-border rounded-lg p-2 bg-white">
        <Image
          src={qrCodeUrl}
          alt="Testimonial QR Code"
          width={size}
          height={size}
          className="rounded"
        />
      </div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        Download QR Code
      </button>
    </div>
  )
}
