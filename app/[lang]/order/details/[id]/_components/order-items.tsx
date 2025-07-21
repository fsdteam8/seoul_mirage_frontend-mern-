"use client";

import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  width={500}
                  height={500}
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
            <div className="text-lg font-medium text-gray-900">
              <span className="text-[16px]">AED</span> {item.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
