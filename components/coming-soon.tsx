"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./Product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductResponse } from "@/types/ProductDataType";

export default function ComingSoon() {
  const { data, error, isLoading } = useQuery<ProductResponse>({
    queryKey: ["comingsoon"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?paginate_count=4&arrival_status=coming_soon`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    },
  });

  const mappedProducts = data?.data?.data ?? [];

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8" id="new">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">
            Coming soon
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <span className="text-sm md:text-base">View all products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Loading Skeletons */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}

          {/* Error State */}
          {error && (
            <div className="col-span-full text-red-500 text-center">
              Failed to load products. Please try again later.
            </div>
          )}

          {/* No Products Found */}
          {!isLoading && !error && mappedProducts.length === 0 && (
            <div className="col-span-full text-gray-500 text-center">
              No coming soon products available at the moment.
            </div>
          )}

          {/* Render Products */}
          {!isLoading &&
            !error &&
            mappedProducts.length > 0 &&
            mappedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
}
