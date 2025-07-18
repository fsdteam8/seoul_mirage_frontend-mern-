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

export default function AllProducts() {
  const [selectedCategory, setSelectedCategory] = useState("All Product");
  const [sortBy, setSortBy] = useState("Featured");

  const searchParams = useSearchParams();

  const { data: category } = useQuery({
    queryKey: ["productStats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          method: "GET",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch product stats");
      return res.json();
    },
  });

  interface Category {
    id: string;
    name: string;
  }

  interface CategoryApiResponse {
    data: {
      data: Category[];
    };
  }

  const categories = useMemo(() => {
    return [
      "All Product",
      ...((category as CategoryApiResponse)?.data?.data?.map(
        (cat: Category) => cat.name
      ) || []),
    ];
  }, [category]);

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

  const { data, error, isLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?paginate_count=20`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      return res.json();
    },
  });

  if (isLoading) return <ProductPageSkeleton />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const products = data?.data || [];

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

  const filteredProducts =
    products &&
    (products?.data as Product[]).filter(
      (product: Product) =>
        selectedCategory === "All Product" ||
        product?.category?.name === selectedCategory
    );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      // case "Rating":
      //   return b.rating - a.rating;
      // case "Name":
      //   return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen">
      {/* Category Navigation */}
      <div className="bg-[#F5E6D3] border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div
              className="flex space-x-6 overflow-x-auto px-4 scrollbar-hide scroll-snap-x"
              role="tablist"
              aria-label="Product Categories"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
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

            {/* Sort dropdown with responsive smaller width on mobile */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-sm font-medium hidden md:block">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-28 sm:w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Featured">Featured</SelectItem>
                  <SelectItem value="Price: Low to High">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="Price: High to Low">
                    Price: High to Low
                  </SelectItem>
                  {/* <SelectItem value="Rating">Rating</SelectItem>
                  <SelectItem value="Name">Name</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
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
      </div>
    </div>
  );
}
