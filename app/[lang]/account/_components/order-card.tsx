"use client";

import { OrdersResponse } from "@/types/OrderDataType";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const OrderCard = () => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token || "";

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<OrdersResponse>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      return res.json();
    },
    enabled: !!token,
  });

  const orderData = data?.data?.data || [];
  const currentPage = data?.data?.current_page || 1;
  const lastPage = data?.data?.last_page || 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load orders. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (orderData.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          You have no order history available at the moment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-6 ">
        {orderData.map((order) => (
          <div
            key={order.id}
            className="w-full mx-auto border rounded-xl shadow-sm p-4 space-y-4 text-sm sm:text-base"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="space-y-1">
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-col sm:items-end sm:text-right mt-2 sm:mt-0">
                <p
                  className={`font-medium ${order.status === "Pending"
                      ? "text-yellow-500"
                      : order.status === "delivered"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </p>
                <p className="text-gray-800 font-semibold text-sm mt-1">
                  ${parseFloat(order.total).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-700">
                <span>Items ({order.items})</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
              {order.promocode && (
                <div className="flex justify-between text-gray-700">
                  <span>Promocode: {order.promocode.name}</span>
                  <span>Applied</span>
                </div>
              )}
            </div>

            {/* Button */}
            <div>
              <Link href={`/order/details/${order.id}`}>
                <button className="w-full border rounded-md py-2 text-center text-gray-700 hover:bg-gray-100 transition">
                  View Order Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={page <= 1 ? "pointer-events-none  opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 py-2 border rounded-md text-sm text-gray-700">
              Page {currentPage} of {lastPage}
            </span>
          </PaginationItem>
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
              className={
                page >= lastPage ? "pointer-events-none  opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default OrderCard;
