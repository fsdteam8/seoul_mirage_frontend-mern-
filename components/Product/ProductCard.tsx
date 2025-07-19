"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // assuming ShadCN UI
import { Product, useCartStore } from "@/store/cart-store";
// import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

// StarRating Component
function StarRating({
  rating,
  maxStars = 5,
}: {
  rating: number;
  maxStars?: number;
}) {
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className="w-4 h-4 fill-black" />);
    } else if (rating >= i - 0.5) {
      stars.push(
        <StarHalf key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
      );
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return <div className="flex items-center gap-1">{stars}</div>;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem({ ...product, quantity: 1 });
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <Link href={`/products/${product?.id}`} className="block">
        <div
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product?.media?.[0]?.file_path || "/asset/no-image.jpg"}
              alt={product?.name || "Product Image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div
              className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                }`}
            >
              {product?.arrival_status !== "coming_soon" && (
                <Button
                  onClick={handleAddToCart}
                  className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-600 mb-1">
              {product?.category?.name ?? "Uncategorized"}
            </p>
            {/* <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {product?.name?.slice(0,50)}
            </h3> */}
            <h3 className="font-semibold text-lg mb-2">
              {product?.name?.length > 60
                ? product.name.slice(0, 60) + "..."
                : product?.name}
            </h3>
            {product?.arrival_status !== "coming_soon" && (
              <>
                <p className="text-2xl font-bold mb-2">
                  <span className="text-[16px]">AED</span> {product?.price}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <StarRating rating={Number(product?.reviews_avg_rating) || 0} />
                    <span className="text-sm font-medium">
                      {product?.reviews_avg_rating !== undefined &&
                        product?.reviews_avg_rating !== null
                        ? String(product?.reviews_avg_rating).slice(0, 3)
                        : ""}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product?.reviews_count ?? 0})
                  </span>
                </div>
              </>
            )

            }

          </div>
        </div>
      </Link>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="p-8 space-y-6 text-left max-w-2xl rounded-xl"
          style={{ minHeight: "300px" }}
        >
          <h2 className="text-xl font-bold">Product Added to Cart</h2>

          <div className="flex gap-6">
            <div className="relative w-40 h-40 rounded-md overflow-hidden border">
              <Image
                src={
                  product?.media?.[0]?.file_path
                    ? `${product?.media[0]?.file_path}`
                    : "/asset/no-image.jpg"
                }
                alt={product?.name || "Product Image"}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{product?.name}</h3>
              <p className="text-gray-600">
                Category: {product?.category?.name ?? "Uncategorized"}
              </p>
              <p className="text-lg font-bold">
                <span className="text-sm">AED</span> {product?.price}
              </p>
              <div className="mt-2">
                <StarRating rating={Number(product?.reviews_avg_rating) || 0} />
                <span className="text-sm text-gray-500 ml-2">
                  ({product?.reviews_count ?? 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/cart">
              <Button className="px-6">View Cart</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="px-6"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
