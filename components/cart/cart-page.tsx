"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { DictionaryType } from "@/dictionaries/dictionaries";
// import { useState } from "react";

interface Props {
  dict: DictionaryType;
}

export default function CartPage({ dict }: Props) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/products">
            <Button>{dict.cart.btn}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{dict.cart.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-6"
              >
                <Image
                  src={
                    item?.media?.[0]?.file_path
                      ? `${item.media[0].file_path}`
                      : "/placeholder.svg"
                  }
                  alt={item?.name || "Image"}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">
                    {dict.cart.quantity} : {item.quantity}
                  </p>
                  {/* <p className="text-sm text-gray-500">
                    In Stock: {item.stock_quantity}
                  </p> */}

                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (item.quantity < item.stock_quantity) {
                          updateQuantity(item.id, item.quantity + 1);
                        }
                      }}
                      disabled={item.quantity >= item.stock_quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    {" "}
                    <span className="text-[16px]">AED</span> {item.price}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Link href="/products" className="mt-6 inline-block">
              <Button variant="outline">{dict.cart.btn}</Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="bg-[#F5E6D3] p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">{dict.cart.order}</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{dict.cart.subtotal}</span>
                <span>
                  {" "}
                  <span className="text-[16px]">AED</span> {subtotal.toFixed(2)}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>{dict.cart.total}</span>
                <span>
                  {" "}
                  <span className="text-[16px]">AED</span> {subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                {dict.cart.checkout}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
