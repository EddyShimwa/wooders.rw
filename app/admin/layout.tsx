'use client'

import { ReactNode } from 'react'
import { AdminHeader } from '@/components/AdminHeader'
import { useRequireAdmin } from '@/hooks/useAdminAuth'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const adminQuery = useRequireAdmin()

  if (adminQuery.isLoading) {
    return <div className="container mx-auto py-12">Checking credentials...</div>
  }

  if (adminQuery.isError) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminName={adminQuery.data?.name} />
      <div className="container mx-auto py-8 px-4 animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  )
}
