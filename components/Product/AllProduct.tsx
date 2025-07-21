"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductPageSkeleton } from "./ProductSkeleton";

// ✅ Types
interface Category {
  id: string;
  name: string;
}

interface CategoryApiResponse {
  data: {
    data: Category[];
  };
}

interface Product {
  id: string;
  category: {
    id: string;
    name: string;
  };
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
}

interface ProductApiResponse {
  data: {
    data: Product[];
    pagination: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}

export default function AllProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Product");
  const [selecteRateing, setSelecteRateing] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("Featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();

  // ✅ Fetch categories
  const { data: categoryData } = useQuery<CategoryApiResponse>({
    queryKey: ["productCategories"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });


  const categories: string[] = useMemo(() => {
    const serverCategories = categoryData?.data?.data ?? [];
    return ["All Product", ...serverCategories.map((cat) => cat.name)];
  }, [categoryData]);

  const normalizeCategoryKey = (str: string) =>
    str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    const categoryFromQuery =
      searchParams.get("category") ||
      Array.from(searchParams.entries()).find(([key]) =>
        categories.includes(normalizeCategoryKey(key))
      )?.[0];

    if (
      categoryFromQuery &&
      categories.includes(normalizeCategoryKey(categoryFromQuery))
    ) {
      setSelectedCategory(normalizeCategoryKey(categoryFromQuery));
    }
  }, [searchParams, categories]);


  const { data, error, isLoading } = useQuery<ProductApiResponse>({
    queryKey: ["allProducts", selectedCategory, currentPage, selecteRateing],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (selectedCategory !== "All Product") {
        params.append("category", selectedCategory);
      }
      if (selecteRateing !== "All") {
        params.append("rating", selecteRateing);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },

  });

  const products = useMemo(() => data?.data?.data ?? [], [data]);
  const pagination = data?.data?.pagination;

  // ✅ Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "Price: Low to High":
        return sorted.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // ✅ Loading / error state
  if (isLoading) return <ProductPageSkeleton />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen">
      {/* Category Navigation */}



      <div className="bg-[#F5E6D3] border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 space-y-4 lg:flex lg:justify-between ">
          {/* Categories Scrollable */}
          <div
            className="flex space-x-6 overflow-x-auto px-1 sm:px-4 scrollbar-hide scroll-snap-x"
            role="tablist"
            aria-label="Product Categories"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 text-sm font-medium transition-colors whitespace-nowrap scroll-snap-align-start ${selectedCategory === category
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-600 hover:text-black"
                  }`}
                role="tab"
                aria-selected={selectedCategory === category}
                tabIndex={selectedCategory === category ? 0 : -1}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Rating + Sort (Group them for smaller layout) */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Rating Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium hidden md:block">Rating:</span>
                <Select value={selecteRateing} onValueChange={setSelecteRateing}>
                  <SelectTrigger className="w-28 sm:w-40 bg-white">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium hidden md:block">Sort:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-28 sm:w-40 bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Featured">Featured</SelectItem>
                    <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
                    <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Product Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-sm py-10">
              No products found in this category.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination && (
          <div className="flex justify-center items-center mt-10 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={pagination.current_page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.last_page)
                )
              }
              disabled={pagination.current_page === pagination.last_page}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
