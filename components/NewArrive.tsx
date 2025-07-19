// "use client";

// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import ProductCard from "./Product/ProductCard";
// import { useQuery } from "@tanstack/react-query";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ProductResponse } from "@/types/ProductDataType";

// export default function NewArrive() {
//   const { data, error, isLoading } = useQuery<ProductResponse>({
//     queryKey: ["newProducts"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/products?paginate_count=4`
//       );
//       if (!res.ok) {
//         throw new Error("Failed to fetch products");
//       }
//       return res.json();
//     },
//   });

//   // Make sure this matches your API structure
//   const mappedProducts = data?.data?.data ?? [];

//   return (
//     <section className="py-12 px-4 md:px-6 lg:px-8" id="new">
//       <div className="container mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-xl md:text-2xl font-medium text-gray-900">
//             New Arrive
//           </h2>
//           <Link
//             href="/products"
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
//           >
//             <span className="text-sm md:text-base">View all products</span>
//             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
//           </Link>
//         </div>

//         {/* Product Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {isLoading &&
//             Array.from({ length: 4 }).map((_, index) => (
//               <div key={index} className="space-y-4">
//                 <Skeleton className="w-full h-48 rounded-lg" />
//                 <Skeleton className="w-3/4 h-4" />
//                 <Skeleton className="w-1/2 h-4" />
//               </div>
//             ))}

//           {error && (
//             <div className="col-span-full text-red-500 text-center">
//               Failed to load products. Please try again later.
//             </div>
//           )}

//           {!isLoading &&
//             !error &&
//             mappedProducts.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./Product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductResponse } from "@/types/ProductDataType";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewArrive() {
  const { data, error, isLoading } = useQuery<ProductResponse>({
    queryKey: ["newProducts"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?paginate_count=60`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    },
  });

  const mappedProducts = data?.data?.data ?? [];

  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto Slide
  useEffect(() => {
    if (!api) return;

    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 3000); // Slide every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8" id="new">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">
            New Arrive
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <span className="text-sm md:text-base">View all products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-[250px] space-y-4">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <div className="relative">
            {/* Carousel */}
            <Carousel
              className="w-full"
              opts={{ loop: true }}
              setApi={setApi}
            >
              <CarouselContent>
                {mappedProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="md:basis-1/2 lg:basis-1/4"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full bg-white shadow-md"
                onClick={() => api?.scrollPrev()}
              >
                <ArrowLeft />
              </Button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full bg-white shadow-md"
                onClick={() => api?.scrollNext()}
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
