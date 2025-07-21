"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Search, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { SearchResponse, SearchProduct } from "@/types/search"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const router = useRouter()

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Search API call
  const {
    data: searchResults,
    isLoading,
    error,
    isFetching,
  } = useQuery<SearchResponse>({
    queryKey: ["productSearch", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return null
      }

      const params = new URLSearchParams({
        search: debouncedQuery,
        // status: "available",
        paginate_count: "20",
      })

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        throw new Error("Failed to search products")
      }

      return res.json()
    },
    enabled: !!debouncedQuery.trim(),
    staleTime: 30000, // Cache for 30 seconds
  })

  const handleProductClick = useCallback(
    (productId: number) => {
      router.push(`/products/${productId}`)
      onOpenChange(false)
      setSearchQuery("")
    },
    [router, onOpenChange],
  )

  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
    setDebouncedQuery("")
  }, [])

  const products = searchResults?.data?.data || []
  const hasResults = products.length > 0
  const showResults = debouncedQuery.trim().length > 0
  const showNoResults = showResults && !isLoading && !hasResults && !error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="sr-only">Search Products</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {!showResults && (
            <div className="p-6 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Search for products</p>
              <p className="text-sm">Start typing to find products by name or description</p>
            </div>
          )}

          {showResults && (
            <div className="p-4">
              {/* Loading State */}
              {(isLoading || isFetching) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <SearchResultSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">
                    {/* <X className="h-8 w-8 mx-auto mb-2" /> */}
                    <p className="font-medium">Search failed</p>
                  </div>
                  <p className="text-sm text-gray-500">Please try again or check your connection</p>
                </div>
              )}

              {/* No Results */}
              {showNoResults && (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="font-medium text-gray-900 mb-1">No products found</p>
                  <p className="text-sm text-gray-500">Try searching with different keywords</p>
                </div>
              )}

              {/* Results */}
              {hasResults && !isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">{searchResults?.data?.pagination?.total || 0} products found</p>
                    {searchResults?.data.pagination.last_page && searchResults.data.pagination.last_page > 1 && (
                      <p className="text-xs text-gray-500">
                        Showing page {searchResults.data.pagination.current_page} of {searchResults.data.pagination.last_page}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    {products.map((product) => (
                      <SearchResultItem
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Search Result Item Component
function SearchResultItem({
  product,
  onClick,
}: {
  product: SearchProduct
  onClick: () => void
}) {
  const imageUrl = product.media?.[0] ? `${product.media[0].file_path}` : null

  const isOutOfStock = product.status !== "available" || product.stock_quantity === 0

  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left group"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 group-hover:text-black truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category.name}
                </Badge>
                {isOutOfStock && (
                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900">${Number.parseFloat(product.price).toFixed(2)}</p>
              {product.cost_price && Number.parseFloat(product.cost_price) > Number.parseFloat(product.price) && (
                <p className="text-xs text-gray-500 line-through">
                  ${Number.parseFloat(product.cost_price).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

// Skeleton Component
function SearchResultSkeleton() {
  return (
    <div className="p-3 rounded-lg border border-gray-200">
      <div className="flex gap-3">
        <Skeleton className="w-16 h-16 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  )
}
