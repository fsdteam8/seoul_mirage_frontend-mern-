"use client";

import type {
  Category,
  PaginatedCategoryResponse,
} from "@/types/CategoryTypeData";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

// Category Card Component
function CategoryCard({ name, image, }: Category) {
  const router = useRouter();
 const pathname = usePathname();

 const handleClick = () => {
    const formatted = name?.toLowerCase().replace(/\s+/g, "-");
    router.push(`${pathname}/products?${formatted}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative aspect-[3/4] w-full rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-transparent hover:border-white/20"
    >
      {/* Animated border glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 hover:opacity-20 transition-opacity duration-500 blur-sm -z-10 scale-110" />

      <Image
        src={
          image
            ? `${image}`
            : "/asset/no-image.jpg"
        }
        alt={name}
        fill
        className="object-cover transition-all duration-500 hover:scale-110 hover:brightness-110"
      />

      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent hover:from-black/70 hover:via-black/30 transition-all duration-500 flex items-center justify-center">
        <div className="text-center transform transition-all duration-500 hover:scale-110">
          <h3 className="text-white text-xl md:text-2xl font-semibold px-2 drop-shadow-lg hover:drop-shadow-2xl transition-all duration-500">
            {name}
          </h3>

          {/* Animated underline */}
          <div className="w-0 h-0.5 bg-white mx-auto mt-2 hover:w-16 transition-all duration-500 ease-out" />

          {/* Hover text */}
          <p className="text-white/80 text-sm mt-2 opacity-0 hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-2 hover:translate-y-0">
            Explore Collection
          </p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/0 hover:border-white/60 transition-all duration-500 transform rotate-0 hover:rotate-45" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
    </div>
  );
}

// Main Component
export default function ShopByCategory() {
  const [api, setApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);

  const { data, error, isLoading } = useQuery<PaginatedCategoryResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      return await res.json();
    },
  });

  const categoryData = data?.data?.data;

  // Auto-slide functionality
  const scrollNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api || isHovered) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [api, scrollNext, isHovered]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#ebcad04d]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-black mb-8">Shop by Category</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-72 bg-gray-300 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600 bg-red-100 p-4 rounded-md shadow">
            <p className="font-medium">Error loading categories:</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : categoryData && categoryData.length > 0 ? (
          <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {categoryData.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <CategoryCard {...category} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation arrows - only visible on hover */}
              <CarouselPrevious
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                  } bg-white/90 hover:bg-white border-gray-200 shadow-lg`}
              />
              <CarouselNext
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                  } bg-white/90 hover:bg-white border-gray-200 shadow-lg`}
              />
            </Carousel>

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {categoryData.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${api?.selectedScrollSnap() === index
                    ? "bg-gray-800"
                    : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )}
      </div>
    </section>
  );
}
