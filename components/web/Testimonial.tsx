"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DictionaryType } from "@/dictionaries/dictionaries";

interface Review {
  id: number;
  comment: string;
  rating: number;
  user: {
    name: string;
    image: string | null;
  };
}
interface Props {
  dict: DictionaryType;
}
export default function TestimonialCarousel({ dict }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [happyUser, setHappyUser] = useState<{ happyUser: number } | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reviews-home-page`
        );
        const data = await res.json();
       setHappyUser(data)
        if (data.success) {
          setReviews(data.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center mb-10">
        <div className="text-[18px] font-medium text-[#000000CC] mb-4">
          {happyUser?.happyUser}+ Happy Users
        </div>
        <h2 className="text-3xl md:text-[40px] font-bold text-center text-[#C7A18A]">
          {dict.testomonial.title}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <>
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2"
                >
                  <Card className="border-0 shadow-sm h-full">
                    <CardContent className="p-6 mt-[40px] flex flex-col h-full justify-between">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-[258px] md:h-[257px] relative flex-shrink-0">
                          <Image
                            src={
                              review.user.image
                                ? `${process.env.NEXT_PUBLIC_API_URL}/${review.user.image}`
                                : "/asset/reveiw1.png"
                            }
                            alt={review.user.name}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-center sm:text-left">
                          <div className="flex justify-center sm:justify-start text-[#F092B0] mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-[#090914] text-base sm:text-[18px] font-medium leading-relaxed">
                            {review.comment}
                          </p>
                          <p className="font-medium text-[#595959] text-[16px] pt-6">
                            {review.user.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {Array.from({ length: count }, (_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index + 1 === current
                      ? "bg-[#F092B0] w-6"
                      : "bg-gray-300 w-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
