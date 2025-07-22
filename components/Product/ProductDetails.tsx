"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductReviews from "./ProductReviews";
import { useQuery } from "@tanstack/react-query";
import BestSellers from "../BestSerllers";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { Skeleton } from "../ui/skeleton";

export interface Media {
  id: number;
  product_id: number;
  file_path: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  type: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  image: string | null;
  role: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string | null;
  reviews_count: number
  reviews_avg_rating: number
  price: string;
  category_id: number;
  status: string;
  cost_price: string;
  stock_quantity: number;
  sales: number;
  created_at: string;
  updated_at: string;
  category: Category;
  media: Media[];
  reviews: Review[];
}

export interface ProductDetailsResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductDetailsProps {
  productId: string;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const { data, error } = useQuery<ProductDetailsResponse>({
    queryKey: ["productDetails", productId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch product details");
      return res.json();
    },
  });

  const productDetails = data?.data;

  // if (isLoading){}
  // return <div className="container mx-auto px-4 py-8">Loading...</div>;

  if (error || !productDetails)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-5 w-32 mb-6" />

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <Skeleton className="aspect-square w-full rounded-lg" />

              {/* Thumbnails */}
              <div className="hidden lg:flex gap-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                  ))}
              </div>

              <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="w-16 h-16 rounded-lg flex-shrink-0" />
                  ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Product Name */}
              <Skeleton className="h-8 w-3/4" />

              {/* Ratings */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4 rounded-full" />
                    ))}
                </div>
                <Skeleton className="w-16 h-4" />
              </div>

              {/* Price & Discount */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Quantity Selector */}
              <Skeleton className="w-32 h-10 rounded-lg" />

              {/* Add to Cart Button */}
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );

  const product = {
    id: productDetails?.id?.toString(),
    name: productDetails?.name,
    category: productDetails?.category?.name,
    price: parseFloat(productDetails?.price),
    originalPrice:
      parseFloat(productDetails?.cost_price) ||
      parseFloat(productDetails?.price) * 1.5,
    rating: productDetails?.reviews_avg_rating || 0,
    reviews: productDetails?.reviews_count || 0,
    discount:
      Math.round(
        ((parseFloat(productDetails?.cost_price || productDetails?.price) -
          parseFloat(productDetails?.price)) /
          parseFloat(productDetails?.cost_price || productDetails?.price)) *
        100
      ) || 0,
    images: productDetails?.media?.map(
      (m) => `${m.file_path}`
    ),
    description: productDetails?.description || "No description available.",
    details: {
      "STRAIGHT UP": "A high-quality product designed for your needs.",
      "THE LOWDOWN": [
        "Premium quality materials.",
        "Suitable for various uses.",
        "Crafted with care.",
      ],
    },
    stock_quantity: productDetails?.stock_quantity,
    status: productDetails?.status,
  };

  // ✅ FIXED: Passing quantity into addItem
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    addItem({
      ...productDetails,
      quantity, // ✅ pass user-selected quantity
      status:
        productDetails?.status === "active" || productDetails?.status === "inactive"
          ? productDetails?.status
          : "inactive",
    });

    toast.success(`${product.name} has been added to your cart!`, {
      duration: 2000,
      position: "top-center",
      style: {
        backgroundColor: "#f5fff3",
        color: "black",
        fontSize: "16px",
      },
    });
  };

  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                      ? "border-gray-900"
                      : "border-gray-200"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex gap-4">
              <div className="flex flex-col gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                      ? "border-gray-900"
                      : "border-gray-200"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product?.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product?.images[selectedImageIndex] || "/placeholder.svg"}
                  alt={product?.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:hidden aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product?.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product?.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {product?.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product?.rating)
                        ? "fill-black text-black"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product?.reviews} Reviews
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                <span className="text-[16px]">AED</span>{" "}
                {product?.price?.toFixed(2)}
              </span>
              {product?.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  <span className="text-[16px]">AED</span>{" "}
                  {product?.originalPrice?.toFixed(2)}
                </span>
              )}
              {product?.discount > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  Save {product?.discount}% right now
                </span>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Details</h3>
              <p className="text-gray-700">{product.description}</p>

              {Object.entries(product?.details).map(([key, value]) => (
                <div key={key}>
                  <h4 className="font-semibold mb-2">{key}</h4>
                  {Array.isArray(value) ? (
                    <ul className="space-y-1 text-sm text-gray-700">
                      {value.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700">{value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    className="px-3"
                    disabled={product?.stock_quantity <= quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg font-medium"
                disabled={product?.stock_quantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F5D2A899] py-8">
        <ProductReviews productId={productId} />
      </div>

      <BestSellers />
    </section>
  );
}
