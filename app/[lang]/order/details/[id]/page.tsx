// "use client";
// import React, { useState } from "react";
// import OrderHeader from "./_components/order-header";
// import { useRouter } from "next/navigation";
// import OrderItems from "./_components/order-items";
// import ShippingInformation from "./_components/shipping-information";
// import ShippingDetails from "./_components/shipping-details";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";

// interface PageProps {
//   params: { id: string };
// }

// const Page = ({ params }: PageProps) => {
//   const [activeTab, setActiveTab] = useState<"summary" | "shipping">("summary");
//   const session = useSession();
//   const token = (session?.data?.user as { token: string })?.token || "";
//   const router = useRouter();

//   const { data, error, isLoading } = useQuery({
//     queryKey: ["singelOrder", params.id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch order");
//       return res.json();
//     },
//   });

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {(error as Error).message}</div>;
//   if (!data?.data) return <div>No order data found</div>;

//   const order = data.data;

//   // Format the order date
//   const orderDate = new Date(order?.createdAt).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   // Map products to OrderItems format
//   interface ProductPivot {
//     quantity: number;
//   }

//   interface ProductMedia {
//     file_path: string;
//   }

//   interface Product {
//     id: number;
//     name: string;
//     image: string;
//     price: string;
//     pivot: ProductPivot;
//     media?: ProductMedia[];
//   }

//   interface OrderItem {
//     id: string;
//     name: string;
//     image: string;
//     quantity: number;
//     price: number;
//   }

//   const items: OrderItem[] = order.products.map(
//     (product: Product): OrderItem => ({
//       id: product?.id?.toString(),
//       name: product.name,
//       image: product.media?.length
//         ? `${product?.media[0].file_path}`
//         : "",
//       quantity: product?.pivot?.quantity,
//       price: parseFloat(product?.price),
//     })
//   );

//   // Pricing information
//   const pricing = {
//     discount: order.promocode_name ? 0 : 0, // Modify if discount calculation available
//     shipping: parseFloat(order.shipping_price),
//     tax: 0,
//     total: parseFloat(order.total),
//   };

//   // Shipping address fallback from customer
//   const shippingAddress = {
//     name: `${order.customer?.full_name ?? ""} ${
//       order.customer?.last_name ?? ""
//     }`,
//     email: order.customer?.email ?? "",
//     phone: order.customer?.phone ?? "",
//     apartment: "", // Not in API
//     street: order.customer?.full_address ?? "",
//     city: order.customer?.city ?? "",
//     state: order.customer?.state ?? "",
//     zipCode: order.customer?.postal_code ?? "",
//     country: order.customer?.country ?? "",
//   };

//   const shippingDetails = {
//     shippingMethod: order.shipping_method
//       ? `${
//           order?.shipping_method?.charAt(0).toUpperCase() +
//           order?.shipping_method?.slice(1)
//         } Shipping`
//       : "Standard Shipping",
//     trackingNumber: "N/A",
//     estimatedDelivery: "N/A",
//   };

//   const handleBackToAccount = () => {
//     router.push("/account");
//   };

//   return (
//     <div>
//       <div className="min-h-screen bg-[#f5e6d3] py-8">
//         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <OrderHeader
//               orderNumber={`Order ${order?.id?.slice(0, 8)}`}
//               orderDate={`Placed on ${orderDate}`}
//               status={
//                 order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)
//               }
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//               onBackToAccount={handleBackToAccount}
//             />

//             {activeTab === "summary" && (
//               <>
//                 <OrderItems items={items} />
//                 <ShippingInformation
//                   discount={pricing?.discount}
//                   shipping={pricing?.shipping}
//                   tax={pricing?.tax}
//                   total={pricing?.total}
//                 />
//               </>
//             )}

//             {activeTab === "shipping" && (
//               <ShippingDetails
//                 address={shippingAddress}
//                 shippingMethod={shippingDetails.shippingMethod}
//                 trackingNumber={shippingDetails.trackingNumber}
//                 estimatedDelivery={shippingDetails.estimatedDelivery}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

"use client";

import React, { useState } from "react";
import OrderHeader from "./_components/order-header";
import { useRouter } from "next/navigation";
import OrderItems from "./_components/order-items";
import ShippingInformation from "./_components/shipping-information";
import ShippingDetails from "./_components/shipping-details";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: { id: string };
}

const Page = ({ params }: PageProps) => {
  const [activeTab, setActiveTab] = useState<"summary" | "shipping">("summary");
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token || "";
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["singleOrder", params.id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
  });

  if (isLoading) return <div className="min-h-screen bg-[#f5e6d3] py-8">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-4 pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Order Items */}
        <div className="space-y-4 pt-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-20 w-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="border-t pt-4 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    </div>
  </div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data?.data) return <div>No order data found</div>;

  const order = data.data;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  interface Product {
    _id: string;
    name: string;
    price: number;
    media?: { file_path: string }[];
  }

  interface OrderItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }

  const items: OrderItem[] = order.products.map(
    (item: { product: Product; quantity: number }): OrderItem => ({
      id: item.product._id,
      name: item.product.name,
      image: item.product.media?.[0]?.file_path ?? "",
      quantity: item.quantity,
      price: parseFloat(item.product.price?.toString() ?? "0"),
    })
  );

  const pricing = {
    discount: order.promocode_name ? 0 : 0, // Modify when discount logic available
    shipping: parseFloat(order.shipping_price?.toString() || "0"),
    tax: 0,
    total: parseFloat(order.total?.toString() || "0"),
  };

  const shippingAddress = {
    name: order.customer?.name ?? "",
    email: order.customer?.email ?? "",
    phone: order.customer?.phone ?? "",
    apartment: "", // Not in API
    street: order.customer?.full_address ?? "",
    city: order.customer?.city ?? "",
    state: order.customer?.state ?? "",
    zipCode: order.customer?.postal_code ?? "",
    country: order.customer?.country ?? "",
  };

  const shippingDetails = {
    shippingMethod: order.shipping_method
      ? `${order.shipping_method.charAt(0).toUpperCase()}${order.shipping_method.slice(1)} Shipping`
      : "Standard Shipping",
    trackingNumber: "N/A",
    estimatedDelivery: "N/A",
  };

  const handleBackToAccount = () => {
    router.push("/account");
  };

  return (
    <div>
      <div className="min-h-screen bg-[#f5e6d3] py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <OrderHeader
              orderNumber={`Order ${order._id.slice(0, 8)}`}
              orderDate={`Placed on ${orderDate}`}
              status={
                order.status?.charAt(0).toUpperCase() + order.status?.slice(1)
              }
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onBackToAccount={handleBackToAccount}
            />

            {activeTab === "summary" && (
              <>
                <OrderItems items={items} />
                <ShippingInformation
                  discount={pricing.discount}
                  shipping={pricing.shipping}
                  tax={pricing.tax}
                  total={pricing.total}
                />
              </>
            )}

            {activeTab === "shipping" && (
              <ShippingDetails
                address={shippingAddress}
                shippingMethod={shippingDetails.shippingMethod}
                trackingNumber={shippingDetails.trackingNumber}
                estimatedDelivery={shippingDetails.estimatedDelivery}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
