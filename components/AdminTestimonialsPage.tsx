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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  getAllTestimonials,
  deleteTestimonial,
  approveTestimonial,
  rejectTestimonial,
} from '@/lib/api/testimonialService'
import { Testimonial } from '@/types/testimonial'
import { Trash2, RefreshCw, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

const TESTIMONIAL_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
}

export function AdminTestimonialsPage() {
  const queryClient = useQueryClient()
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
                                if (testimonial._id || testimonial.id) {
                                  deleteTestimonialMutation.mutate(
                                    (testimonial._id || testimonial.id) as string
                                  )
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {generatePaginationItems().map((item, index) => (
                    <Button
                      key={index}
                      variant={item === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => typeof item === 'number' && setCurrentPage(item)}
                      disabled={typeof item === 'string'}
                      className="min-w-[40px]"
                    >
                      {item}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Testimonial Details</DialogTitle>
          </DialogHeader>
          {viewingTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {viewingTestimonial.photo ? (
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={viewingTestimonial.photo}
                      alt={viewingTestimonial.name}
                    />
                    <AvatarFallback>{viewingTestimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{viewingTestimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h3 className="font-semibold">{viewingTestimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewingTestimonial.email}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Feedback:</h4>
                <p className="text-sm leading-relaxed">{viewingTestimonial.feedback}</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  className={`${TESTIMONIAL_STATUS_COLORS[viewingTestimonial.status]} capitalize text-white`}
                >
                  {viewingTestimonial.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {viewingTestimonial.createdAt
                    ? new Date(viewingTestimonial.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}