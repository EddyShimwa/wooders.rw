"use client"

import React, { useState } from "react"
import { Header } from "@/components/Header"

export default function HeaderClient() {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [wishlistCount] = useState(0)

  return (
    <Header
      onOrderTrackingClick={() => setIsTrackingOpen(true)}
      onWishlistClick={() => setIsWishlistOpen(true)}
      wishlistCount={wishlistCount}
    />
  )
}
