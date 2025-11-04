'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { logoutAdmin } from '@/lib/api/adminService'

interface AdminHeaderProps {
  adminName?: string
}

export function AdminHeader({ adminName = 'Admin' }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'me'] })
      toast.success('Logged out')
      window.location.href = '/admin/login'
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.'
      toast.error('Failed to logout', {
        description: errorMessage,
      })
    },
  })

  const getActiveTab = () => {
    if (pathname.includes('/testimonials')) return 'testimonials'
    if (pathname.includes('/orders')) return 'orders'
    return 'orders' // default to orders
  }

  const handleTabChange = (tab: string) => {
    if (tab === 'orders') {
      router.push('/admin/orders')
    } else if (tab === 'testimonials') {
      router.push('/admin/testimonials')
    }
  }

  return (
    <div className="border-b bg-card transition-colors duration-200">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {adminName}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage orders and testimonials</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
              className="transition-all duration-200 hover:scale-110"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 transition-all duration-200">
            <TabsTrigger value="orders" className="transition-all duration-200">Orders</TabsTrigger>
            <TabsTrigger value="testimonials" className="transition-all duration-200">Testimonials</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
