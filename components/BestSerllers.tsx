"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./Product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiResponse } from "@/types/BestSellersDataType";

export default function BestSellers() {
  const { data, error, isLoading } = useQuery<ApiResponse>({
    queryKey: ["bestSellers"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/best-selling-products`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch best-selling products");
      }

      const data: ApiResponse = await res.json();
      return data;
    },
  });

  const bestSellerProducts = data?.data?.data;

  return (
    <section className="py-5 px-1 md:px-6 lg:px-8 container mx-auto" id="best">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">
            Bestsellers
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
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-4">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}

          {error && (
            <div className="col-span-full text-red-500 text-center">
              Failed to load products. Please try again later.
            </div>
          )}

          {!isLoading &&
            !error &&
            bestSellerProducts &&
            bestSellerProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
}
