"use client";

import type React from "react";
import { useState } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  user: {
    name: string;
    id: string;
    email: string;
    image: string;
  };
  created_at: string;
  createdAt:string
}

interface ReviewsSectionProps {
  productId: string;
}

function StarRating({
  rating,
  size = "w-4 h-4",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating ? "fill-black text-black" : "fill-white text-white"
          }`}
        />
      ))}
    </div>
  );
}

function WriteReviewModal({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token || "";
  const [formData, setFormData] = useState({ rating: 5, comment: "" });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        setIsOpen(false);
        throw new Error(error.message || "Failed to submit");
      }

      return res.json();
    },

    onSuccess: (data) => {
      toast.success(data.message || "Review added successfully");
      setFormData({ rating: 5, comment: "" });
      setIsOpen(false);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
      setIsOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fromdata = new FormData();
    fromdata.append("product_id", productId);
    fromdata.append("comment", formData.comment);
    fromdata.append("rating", formData.rating.toString());

    mutation.mutate(fromdata);
    setFormData({ rating: 5, comment: "" });
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full px-6">
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? "fill-black text-black"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            {token ? (
              <Button type="submit" className="flex-1">
                Submit Review
              </Button>
            ) : (
              <Link href="/login" className="flex-1">
                <Button className="w-full">Please Login</Button>
              </Link>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductReviews({ productId }: ReviewsSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["getReviews", productId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const reviewData: Review[] = data?.data?.reviews || [];
  const averageRating =
    reviewData.length > 0
      ? reviewData.reduce((sum, review) => sum + review.rating, 0) /
        reviewData.length
      : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ratings and Reviews
            </h2>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={Math.round(averageRating)} size="w-5 h-5" />
              <span className="text-lg font-medium text-gray-700">
                {reviewData.length} Reviews
              </span>
            </div>

            <WriteReviewModal productId={productId} />
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6 overflow-x-auto max-w-full">
          {isLoading ? (
            <div className="space-y-6 min-w-[500px]">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse space-y-2 border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gray-300 w-10 h-10 sm:w-12 sm:h-12" />
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-gray-300 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mt-2" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : reviewData.length > 0 ? (
            <div className="flex flex-col gap-6 min-w-[500px]">
              {reviewData.map((review) => (
                <div key={review?.id} className="border-b border-gray-400 pb-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                      <AvatarImage
                        src={review?.userAvatar || "/placeholder.svg"}
                        alt={review?.userName}
                      />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <StarRating rating={review?.rating} />
                      </div>

                      <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">
                        {review?.comment}
                      </p>

                      <div className="text-sm text-gray-500">
                        <p className="font-medium text-gray-900">
                          {review?.user?.name}
                        </p>
                        <p>
                          {new Date(review?.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet for this product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
