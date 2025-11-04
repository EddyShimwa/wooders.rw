'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { toast } from 'sonner'
import {
  getAllTestimonials,
  deleteTestimonial,
  approveTestimonial,
  rejectTestimonial,
} from '@/lib/api/testimonialService'
import { Testimonial } from '@/types/testimonial'
import { Trash2, RefreshCw, Check, X, Eye, QrCode } from 'lucide-react'
import { useRouter } from 'next/navigation'

const TESTIMONIAL_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
}

export function AdminTestimonialsPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [testimonialsFilter, setTestimonialsFilter] = useState<string>('all')
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const testimonialsQuery = useQuery({
    queryKey: ['admin', 'testimonials', testimonialsFilter],
    queryFn: () => {
      const status = testimonialsFilter !== 'all' ? testimonialsFilter : undefined
      return getAllTestimonials(status)
    },
  })

  const approveMutation = useMutation({
    mutationFn: (testimonialId: string) => approveTestimonial(testimonialId),
    onSuccess: () => {
      toast.success('Testimonial approved')
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.'
      toast.error('Failed to approve testimonial', {
        description: errorMessage,
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (testimonialId: string) => rejectTestimonial(testimonialId),
    onSuccess: () => {
      toast.success('Testimonial rejected')
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.'
      toast.error('Failed to reject testimonial', {
        description: errorMessage,
      })
    },
  })

  const deleteTestimonialMutation = useMutation({
    mutationFn: (testimonialId: string) => deleteTestimonial(testimonialId),
    onSuccess: () => {
      toast.success('Testimonial deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
      setCurrentPage(1)
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.'
      toast.error('Failed to delete testimonial', {
        description: errorMessage,
      })
    },
  })

  const testimonials = useMemo(() => testimonialsQuery.data ?? [], [testimonialsQuery.data])

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE)
  const paginatedTestimonials = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return testimonials.slice(startIndex, endIndex)
  }, [testimonials, currentPage])

  const generatePaginationItems = (): (number | string)[] => {
    const items: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      items.push(1)
      if (currentPage > 3) items.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!items.includes(i)) items.push(i)
      }
      if (currentPage < totalPages - 2) items.push('...')
      items.push(totalPages)
    }
    return items
  }

  const testimonialStats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Testimonial Management</CardTitle>
              <CardDescription>Review, approve, or reject customer testimonials.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={testimonialsFilter} onValueChange={(value) => {
                setTestimonialsFilter(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-40 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Testimonials</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => testimonialsQuery.refetch()}
                disabled={testimonialsQuery.isLoading || testimonialsQuery.isFetching}
                size="icon"
              >
                <RefreshCw
                  className={`h-4 w-4 ${testimonialsQuery.isFetching ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {testimonialsQuery.isLoading ? (
            <div className="text-center py-8 h-[30vh] text-muted-foreground">
              Loading testimonials...
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {testimonialsFilter === 'all'
                ? 'No testimonials yet. Customers can submit feedback from the home page.'
                : `No ${testimonialsFilter} testimonials.`}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTestimonials.map((testimonial) => (
                      <TableRow key={testimonial._id || testimonial.id} className="transition-colors duration-200 hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {testimonial.photo ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={testimonial.photo}
                                  alt={testimonial.name}
                                />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <span className="font-medium">{testimonial.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{testimonial.email}</TableCell>
                        <TableCell>
                          <p className="text-sm line-clamp-2 max-w-xs">
                            {testimonial.feedback}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${TESTIMONIAL_STATUS_COLORS[testimonial.status]} capitalize text-white transition-all duration-200`}
                          >
                            {testimonial.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {testimonial.createdAt
                            ? new Date(testimonial.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setViewingTestimonial(testimonial)
                                setIsViewDialogOpen(true)
                              }}
                              title="View full testimonial"
                              className="transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {testimonial.status !== 'approved' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (testimonial._id || testimonial.id) {
                                    approveMutation.mutate(
                                      (testimonial._id || testimonial.id) as string
                                    )
                                  }
                                }}
                                disabled={approveMutation.isPending}
                                title="Approve testimonial"
                                className="transition-all duration-200"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {testimonial.status !== 'rejected' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (testimonial._id || testimonial.id) {
                                    rejectMutation.mutate(
                                      (testimonial._id || testimonial.id) as string
                                    )
                                  }
                                }}
                                disabled={rejectMutation.isPending}
                                title="Reject testimonial"
                                className="transition-all duration-200"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (window.confirm('Delete this testimonial?')) {
                                  if (testimonial._id || testimonial.id) {
                                    deleteTestimonialMutation.mutate(
                                      (testimonial._id || testimonial.id) as string
                                    )
                                  }
                                }
                              }}
                              disabled={deleteTestimonialMutation.isPending}
                              title="Delete testimonial"
                              className="transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer transition-all duration-200 hover:bg-accent'}
                      />
                    </PaginationItem>

                    {generatePaginationItems().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page as number)
                            }}
                            isActive={page === currentPage}
                            className="transition-all duration-200"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer transition-all duration-200 hover:bg-accent'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Full Testimonial View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Testimonial Details</DialogTitle>
            <DialogDescription>View the complete testimonial</DialogDescription>
          </DialogHeader>
          {viewingTestimonial && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{viewingTestimonial.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{viewingTestimonial.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Feedback</p>
                <p className="text-base leading-relaxed">{viewingTestimonial.feedback}</p>
              </div>

              {viewingTestimonial.photo && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Photo</p>
                  <img
                    src={viewingTestimonial.photo}
                    alt={viewingTestimonial.name}
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={`${TESTIMONIAL_STATUS_COLORS[viewingTestimonial.status]} capitalize text-white mt-1`}
                  >
                    {viewingTestimonial.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {viewingTestimonial.createdAt
                      ? new Date(viewingTestimonial.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
