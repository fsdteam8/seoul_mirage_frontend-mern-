// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useCartStore } from "@/store/cart-store";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { createCheckoutSession, OrderData } from "@/types/order";
// import Image from "next/image";
// import { DictionaryType } from "@/dictionaries/dictionaries";

// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   apartment: string;
//   city: string;
//   state: string;
//   postal: string;
//   country: string;
//   promo: string;
// }

// interface PromoInfo {
//   id: number;
//   name: string;
//   description: string;
//   type: "fixed" | "percentage";
//   status: "Active" | "inactive";
//   usage_limit: string;
//   amount: string;
//   created_at: string;
//   updated_at: string;
//   orders_count: number;
// }

// interface Props{
//     dict:DictionaryType
// }

// export default function CheckoutPage({dict}:Props) {
//   const { items, getTotalPrice, clearCart } = useCartStore();
//   const [shippingMethod, setShippingMethod] = useState("standard");
//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     apartment: "",
//     city: "",
//     state: "",
//     postal: "",
//     country: "",
//     promo: "",
//   });
//   const [promoInfo, setPromoInfo] = useState<PromoInfo | null>(null);

//   const subtotal = getTotalPrice();
//   const shippingCosts = {
//     standard: 5.99,
//     express: 12.99,
//     overnight: 24.99,
//   };
//   const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts];

//   const discount =
//     promoInfo && promoInfo.status === "Active"
//       ? promoInfo.type === "fixed"
//         ? parseFloat(promoInfo.amount)
//         : (parseFloat(promoInfo.amount) / 100) * subtotal
//       : 0;

//   const total = Math.max(0, subtotal + shipping - discount);

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "{{url}}";

//   const createCheckoutMutation = useMutation({
//     mutationFn: createCheckoutSession,
//     onSuccess: (checkoutResponse) => {
//       if (
//         checkoutResponse.status === "success" &&
//         checkoutResponse.checkout_url
//       ) {
//         clearCart();
//         window.location.href = checkoutResponse.checkout_url;
//       } else {
//         toast.error("Failed to create checkout session");
//       }
//     },
//     onError: (error) => {
//       console.error("Checkout Error:", error);
//       toast.error(`Failed to create checkout session: ${error.message}`);
//     },
//   });

//   const createOrderMutation = useMutation({
//     mutationFn: async (orderData: OrderData) => {
//       const response = await fetch(`${API_BASE_URL}/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `Failed to create order: ${response.status}`
//         );
//       }

//       return response.json();
//     },
//     onSuccess: (orderResponse) => {
//       createCheckoutMutation.mutate({
//         order_id: orderResponse.data.order.id,
//         email: formData.email,
//       });
//     },
//     onError: (error) => {
//       console.error("❌ Order Creation Failed:", error);
//       toast.error(`Failed to create order: ${error.message}`);
//     },
//   });

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData((prev) => {
//       const newState = { ...prev, [field]: value };
//       // Reset state if country changes, to avoid invalid state selection
//       if (field === "country" && prev.country !== value) {
//         newState.state = "";
//       }
//       return newState;
//     });
//   };

//   const validateForm = (): boolean => {
//     const requiredFields: (keyof FormData)[] = [
//       "firstName",
//       "lastName",
//       "email",
//       "phone",
//       "city",
//       "state",
//       "postal",
//       "country",
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field].trim()) {
//         toast.error(
//           `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
//         );
//         return false;
//       }
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address");
//       return false;
//     }

//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return false;
//     }

//     return true;
//   };

//   const handlePayment = () => {
//     if (!validateForm()) return;

//     const orderData: OrderData = {
//       full_name: formData.firstName,
//       last_name: formData.lastName,
//       email: formData.email,
//       phone: formData.phone,
//       full_address: formData.apartment
//         ? `${formData.apartment}, ${formData.city}`
//         : formData.city,
//       city: formData.city,
//       state: formData.state,
//       postal_code: formData.postal,
//       country: formData.country,
//       type: "online",
//       items: items.length.toString(),
//       status: "pending",
//       shipping_method: shippingMethod,
//       shipping_price: shipping.toString(),
//       order_summary: items
//         .map((item) => `${item.name} x${item.quantity}`)
//         .join(", "),
//       payment_method: "cash_on_delivery",
//       payment_status: "unpaid",
//       promocode_id: promoInfo?.id?.toString(),
//       total: total.toString(),
//       products: items.map((item) => ({
//         product_id: item.id.toString(),
//         quantity: item.quantity.toString(),
//       })),
//       promocode_name: formData.promo || undefined,
//     };

//     createOrderMutation.mutate(orderData);
//   };

//   const isLoading =
//     createOrderMutation.isPending || createCheckoutMutation.isPending;

//   const handleUsePromoCode = async () => {
//     if (!formData.promo) {
//       toast.error("Please enter a promo code");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/api/promocodes?search=${formData.promo}&for=use_in_order`
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch promo code");
//       }

//       const data = await res.json();

//       if (data?.data?.data?.length > 0) {
//         const promo = data.data.data[0];

//         if (promo.status !== "Active") {
//           setPromoInfo(null);
//           toast.error("Promo code is not active");
//           return;
//         }

//         if (parseInt(promo.orders_count) >= parseInt(promo.usage_limit)) {
//           setPromoInfo(null);
//           toast.error("Promo code has reached its usage limit");
//           return;
//         }

//         const discountAmount =
//           promo.type === "fixed"
//             ? parseFloat(promo.amount)
//             : (parseFloat(promo.amount) / 100) * subtotal;

//         if (isNaN(discountAmount) || discountAmount <= 0) {
//           setPromoInfo(null);
//           toast.error("Invalid promo code amount");
//           return;
//         }

//         setPromoInfo(promo);
//         toast.success("Promo code applied!");
//       } else {
//         setPromoInfo(null);
//         toast.error("Invalid promo code");
//       }
//     } catch (error) {
//       console.error("Promo code fetch error:", error);
//       toast.error("Something went wrong while applying promo code");
//     }
//   };

//   // Define states for different countries
//   // const bangladeshStates = [
//   //   { value: "dhaka", label: "Dhaka" },
//   //   { value: "chittagong", label: "Chittagong" },
//   //   { value: "sylhet", label: "Sylhet" },
//   //   { value: "rajshahi", label: "Rajshahi" },
//   //   { value: "khulna", label: "Khulna" },
//   //   { value: "barisal", label: "Barisal" },
//   //   { value: "rangpur", label: "Rangpur" },
//   //   { value: "mymensingh", label: "Mymensingh" },
//   // ];

//   // const usStates = [
//   //   { value: "AL", label: "Alabama" },
//   //   { value: "AK", label: "Alaska" },
//   //   { value: "AZ", label: "Arizona" },
//   //   { value: "AR", label: "Arkansas" },
//   //   { value: "CA", label: "California" },
//   //   { value: "CO", label: "Colorado" },
//   //   { value: "CT", label: "Connecticut" },
//   //   { value: "DE", label: "Delaware" },
//   //   { value: "FL", label: "Florida" },
//   //   { value: "GA", label: "Georgia" },
//   //   { value: "HI", label: "Hawaii" },
//   //   { value: "ID", label: "Idaho" },
//   //   { value: "IL", label: "Illinois" },
//   //   { value: "IN", label: "Indiana" },
//   //   { value: "IA", label: "Iowa" },
//   //   { value: "KS", label: "Kansas" },
//   //   { value: "KY", label: "Kentucky" },
//   //   { value: "LA", label: "Louisiana" },
//   //   { value: "ME", label: "Maine" },
//   //   { value: "MD", label: "Maryland" },
//   //   { value: "MA", label: "Massachusetts" },
//   //   { value: "MI", label: "Michigan" },
//   //   { value: "MN", label: "Minnesota" },
//   //   { value: "MS", label: "Mississippi" },
//   //   { value: "MO", label: "Missouri" },
//   //   { value: "MT", label: "Montana" },
//   //   { value: "NE", label: "Nebraska" },
//   //   { value: "NV", label: "Nevada" },
//   //   { value: "NH", label: "New Hampshire" },
//   //   { value: "NJ", label: "New Jersey" },
//   //   { value: "NM", label: "New Mexico" },
//   //   { value: "NY", label: "New York" },
//   //   { value: "NC", label: "North Carolina" },
//   //   { value: "ND", label: "North Dakota" },
//   //   { value: "OH", label: "Ohio" },
//   //   { value: "OK", label: "Oklahoma" },
//   //   { value: "OR", label: "Oregon" },
//   //   { value: "PA", label: "Pennsylvania" },
//   //   { value: "RI", label: "Rhode Island" },
//   //   { value: "SC", label: "South Carolina" },
//   //   { value: "SD", label: "South Dakota" },
//   //   { value: "TN", label: "Tennessee" },
//   //   { value: "TX", label: "Texas" },
//   //   { value: "UT", label: "Utah" },
//   //   { value: "VT", label: "Vermont" },
//   //   { value: "VA", label: "Virginia" },
//   //   { value: "WA", label: "Washington" },
//   //   { value: "WV", label: "West Virginia" },
//   //   { value: "WI", label: "Wisconsin" },
//   //   { value: "WY", label: "Wyoming" },
//   // ];

//   const uaeStates = [
//     { value: "abudhabi", label: "Abu Dhabi" },
//     { value: "dubai", label: "Dubai" },
//     { value: "sharjah", label: "Sharjah" },
//     { value: "ajman", label: "Ajman" },
//     { value: "ummalquwain", label: "Umm Al-Quwain" },
//     { value: "rasalkhaimah", label: "Ras Al Khaimah" },
//     { value: "fujairah", label: "Fujairah" },
//   ];

//   // const canadaProvinces = [
//   //   { value: "AB", label: "Alberta" },
//   //   { value: "BC", label: "British Columbia" },
//   //   { value: "MB", label: "Manitoba" },
//   //   { value: "NB", label: "New Brunswick" },
//   //   { value: "NL", label: "Newfoundland and Labrador" },
//   //   { value: "NS", label: "Nova Scotia" },
//   //   { value: "ON", label: "Ontario" },
//   //   { value: "PE", label: "Prince Edward Island" },
//   //   { value: "QC", label: "Quebec" },
//   //   { value: "SK", label: "Saskatchewan" },
//   // ];

//   // const ukCountries = [
//   //   { value: "england", label: "England" },
//   //   { value: "scotland", label: "Scotland" },
//   //   { value: "wales", label: "Wales" },
//   //   { value: "northern_ireland", label: "Northern Ireland" },
//   // ];

//   const getStatesForCountry = (country: string) => {
//     switch (country) {
//       // case "bangladesh":
//       //   return bangladeshStates;
//       // case "us":
//       //   return usStates;
//       // case "ca":
//       //   return canadaProvinces;
//       // case "uk":
//       //   return ukCountries;
//       case "ae":
//         return uaeStates;
//       default:
//         return []; // No states for other countries by default
//     }
//   };

//   const currentStates = getStatesForCountry(formData.country);

//   return (
//     <div className="min-h-screen bg-[#F5E6D3]">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-8">{dict.checkout.title}</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2 bg-white p-6 rounded-lg">
//             <div className="space-y-6">
//               {/* Shipping Information */}
//               <div>
//                 <h2 className="text-xl font-semibold mb-4">
//                   {dict.checkout.shipping}
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="firstName">{dict.checkout.flname}</Label>
//                     <Input
//                       id="firstName"
//                       placeholder="John"
//                       value={formData.firstName}
//                       onChange={(e) =>
//                         handleInputChange("firstName", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="lastName">{dict.checkout.lsname}</Label>
//                     <Input
//                       id="lastName"
//                       placeholder="Doe"
//                       value={formData.lastName}
//                       onChange={(e) =>
//                         handleInputChange("lastName", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="email">{dict.checkout.email}</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="john@example.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         handleInputChange("email", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="phone">{dict.checkout.phone}</Label>
//                     <Input
//                       id="phone"
//                       placeholder="01700000001"
//                       value={formData.phone}
//                       onChange={(e) =>
//                         handleInputChange("phone", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <Label htmlFor="apartment">
// {dict.checkout.apartment}
//                     </Label>
//                     <Input
//                       id="apartment"
//                       placeholder="House 1, Road 1"
//                       value={formData.apartment}
//                       onChange={(e) =>
//                         handleInputChange("apartment", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="city">{dict.checkout.city}</Label>
//                     <Input
//                       id="city"
//                       placeholder="abu dhabi"
//                       value={formData.city}
//                       onChange={(e) =>
//                         handleInputChange("city", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                   <div className="col-span-1">
//                     <Label htmlFor="country">{dict.checkout.country}</Label>
//                     <Select
//                       value={formData.country}
//                       onValueChange={(value) =>
//                         handleInputChange("country", value)
//                       }
//                       disabled={isLoading}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {/* <SelectItem value="bangladesh">Bangladesh</SelectItem> */}
//                         {/* <SelectItem value="us">United States</SelectItem> */}
//                         {/* <SelectItem value="ca">Canada</SelectItem> */}
//                         {/* <SelectItem value="uk">United Kingdom</SelectItem> */}
//                         <SelectItem value="ae">Arab Emirates (UAE)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="state">{dict.checkout.state}</Label>
//                     <Select
//                       value={formData.state}
//                       onValueChange={(value) =>
//                         handleInputChange("state", value)
//                       }
//                       disabled={isLoading}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select state" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {currentStates.map((state) => (
//                           <SelectItem key={state.value} value={state.value}>
//                             {state.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="postal">{dict.checkout.postal}</Label>
//                     <Input
//                       id="postal"
//                       placeholder="1205"
//                       value={formData.postal}
//                       onChange={(e) =>
//                         handleInputChange("postal", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Shipping Method */}
//               <div>
//                 <h2 className="text-xl font-semibold mb-4">{dict.checkout.method}</h2>
//                 <RadioGroup
//                   value={shippingMethod}
//                   onValueChange={setShippingMethod}
//                   disabled={isLoading}
//                 >
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="standard" id="standard" />
//                       <Label htmlFor="standard">
//                         Standard Shipping (5-7 business days)
//                       </Label>
//                     </div>
//                     <span className="font-semibold"><span className="text-[16px]">AED</span>  5.99</span>
//                   </div>
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="express" id="express" />
//                       <Label htmlFor="express">
//                         Express Shipping (2-3 business days)
//                       </Label>
//                     </div>
//                     <span className="font-semibold"><span className="text-[16px]">AED</span> 12.99</span>
//                   </div>
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="overnight" id="overnight" />
//                       <Label htmlFor="overnight">
//                         Overnight Shipping (1 business day)
//                       </Label>
//                     </div>
//                     <span className="font-semibold"><span className="text-[16px]">AED</span>  24.99</span>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Error Display */}
//               {(createOrderMutation.error || createCheckoutMutation.error) && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-600 text-sm">
//                     {createOrderMutation.error?.message ||
//                       createCheckoutMutation.error?.message}
//                   </p>
//                 </div>
//               )}

//               <Button
//                 onClick={handlePayment}
//                 disabled={isLoading}
//                 className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     <span>Processing...</span>
//                   </div>
//                 ) : (
//                   "Payment →"
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white p-6 rounded-lg h-fit">
//             <h2 className="text-xl font-semibold mb-4">{dict.checkout.summary}</h2>

//             <div className="space-y-4 mb-6">
//               {items.map((item) => (
//                 <div key={item.id} className="flex items-center space-x-3">
//                   <Image
//                     src={
//                       item?.media?.[0]?.file_path
//                         ? `${item.media[0].file_path}`
//                         : "/placeholder.svg"
//                     }
//                     alt={item?.name || "Image"}
//                     width={100}
//                     height={100}
//                     className="rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       Quantity: {item.quantity}
//                     </p>
//                   </div>
//                   <span className="font-semibold"><span className="text-[16px]">AED</span> {item.price}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-2 border-t pt-4">
//               <div className="flex justify-between">
//                 <span>{dict.checkout.total}</span>
//                 <span><span className="text-[16px]">AED</span> {subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>{dict.checkout.shipping}</span>
//                 <span><span className="text-[16px]">AED</span> {shipping.toFixed(2)}</span>
//               </div>
//               <div>
//                 <Label htmlFor="promo">{dict.checkout.promo}</Label>
//                 <Input
//                   placeholder="FREESHIP"
//                   value={formData.promo}
//                   onChange={(e) => handleInputChange("promo", e.target.value)}
//                   className="mb-2"
//                   id="promo"
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="flex items-center justify-center py-2">
//                 <button
//                   onClick={handleUsePromoCode}
//                   className="bg-black text-white py-2 px-2 w-full hover:bg-gray-700 rounded-lg"
//                   disabled={isLoading}
//                 >
//                   {dict.checkout.redeem}
//                 </button>
//               </div>
//               {promoInfo && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Promo ({formData.promo})</span>
//                   <span>-<span className="text-[16px]">AED</span> {discount.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-lg border-t pt-2">
//                 <span>{dict.checkout.total}</span>
//                 <span><span className="text-[16px]">AED</span> {total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useCartStore } from "@/store/cart-store";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { createCheckoutSession, OrderData } from "@/types/order";
// import Image from "next/image";
// import { DictionaryType } from "@/dictionaries/dictionaries";
// import { useSession } from "next-auth/react";

// interface ShippingDetails {
//   firstName: string;
//   email: string;
//   phone: string;
//   apartment: string;
//   state: string;
//   postal: string;
// }

// interface FormData {
//   shipping_details: ShippingDetails;
//   promo: string;
//   // lastName: string;
//   // city: string;
//   // country: string;
// }

// interface PromoInfo {
//   id: number;
//   name: string;
//   description: string;
//   type: "fixed" | "percentage";
//   status: "Active" | "inactive";
//   usage_limit: string;
//   amount: string;
//   created_at: string;
//   updated_at: string;
//   orders_count: number;
// }

// interface Props {
//   dict: DictionaryType
// }

// export default function CheckoutPage({ dict }: Props) {
//   const { items, getTotalPrice, clearCart } = useCartStore();
//   const [shippingMethod, setShippingMethod] = useState("standard");
//   const [formData, setFormData] = useState<FormData>({
//     shipping_details: {
//       firstName: "",
//       email: "",
//       phone: "",
//       apartment: "",
//       state: "",
//       postal: "",
//     },
//     promo: "",
//     // lastName: "",
//     // city: "",
//     // country: "",
//   });
//   const [promoInfo, setPromoInfo] = useState<PromoInfo | null>(null);
//   const session = useSession();
//   const token = (session?.data?.user as { token: string })?.token || "";
//   const subtotal = getTotalPrice();
//   const shippingCosts = {
//     standard: 5.99,
//     express: 12.99,
//     overnight: 24.99,
//   };
//   const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts];

//   const discount =
//     promoInfo && promoInfo.status === "Active"
//       ? promoInfo.type === "fixed"
//         ? parseFloat(promoInfo.amount)
//         : (parseFloat(promoInfo.amount) / 100) * subtotal
//       : 0;

//   const total = Math.max(0, subtotal + shipping - discount);

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "{{url}}";

//   const createCheckoutMutation = useMutation({
//     mutationFn: createCheckoutSession,
//     onSuccess: (checkoutResponse) => {
//       if (
//         checkoutResponse.status === "success" &&
//         checkoutResponse.checkout_url
//       ) {
//         clearCart();
//         window.location.href = checkoutResponse.checkout_url;
//       } else {
//         toast.error("Failed to create checkout session");
//       }
//     },
//     onError: (error) => {
//       console.error("Checkout Error:", error);
//       toast.error(`Failed to create checkout session: ${error.message}`);
//     },
//   });
//   console.log(token)
//   const createOrderMutation = useMutation({
//     mutationFn: async (orderData: OrderData) => {
//       const response = await fetch(`${API_BASE_URL}/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `Failed to create order: ${response.status}`
//         );
//       }

//       return response.json();
//     },
//     onSuccess: (orderResponse) => {
//       createCheckoutMutation.mutate({
//         order_id: orderResponse.data.order.id,
//         email: formData.shipping_details.email,
//       });
//     },
//     onError: (error) => {
//       console.error("❌ Order Creation Failed:", error);
//       toast.error(`Failed to create order: ${error.message}`);
//     },
//   });

//   const handleInputChange = (field: keyof ShippingDetails, value: string) => {
//     setFormData((prev) => {
//       const newState = {
//         ...prev,
//         shipping_details: {
//           ...prev.shipping_details,
//           [field]: value,
//         },
//       };
//       // Reset state if country changes, to avoid invalid state selection
//       // if (field === "country" && prev.country !== value) {
//       //   newState.state = "";
//       // }
//       return newState;
//     });
//   };

//   const validateForm = (): boolean => {
//     const requiredFields: (keyof ShippingDetails)[] = [
//       "firstName",
//       "email",
//       "phone",
//       "state",
//       "postal",
//       // "lastName",
//       // "city",
//       // "country",
//     ];

//     for (const field of requiredFields) {
//       if (!formData.shipping_details[field].trim()) {
//         toast.error(
//           `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
//         );
//         return false;
//       }
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.shipping_details.email)) {
//       toast.error("Please enter a valid email address");
//       return false;
//     }

//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return false;
//     }

//     return true;
//   };

//   const handlePayment = () => {
//     if (!validateForm()) return;

//     const orderData: OrderData = {
//       shipping_details: {
//         firstName: formData.shipping_details.firstName,
//         email: formData.shipping_details.email,
//         phone: formData.shipping_details.phone,
//         apartment: formData.shipping_details.apartment,
//         state: formData.shipping_details.state,
//         postal: formData.shipping_details.postal,
//       },
//       type: "online",
//       items: items.length.toString(),
//       status: "pending",
//       shipping_method: shippingMethod,
//       shipping_price: shipping.toString(),
//       order_summary: items
//         .map((item) => `${item.name} x${item.quantity}`)
//         .join(", "),
//       payment_method: "cash_on_delivery",
//       payment_status: "unpaid",
//       promocode_id: promoInfo?.id?.toString(),
//       total: total.toString(),
//       products: items.map((item) => ({
//         product_id: item.id.toString(),
//         quantity: item.quantity.toString(),
//       })),
//       promocode_name: formData.promo || undefined,
//     };

//     createOrderMutation.mutate(orderData);
//   };

//   const isLoading =
//     createOrderMutation.isPending || createCheckoutMutation.isPending;

//   const handleUsePromoCode = async () => {
//     if (!formData.promo) {
//       toast.error("Please enter a promo code");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/api/promocodes?search=${formData.promo}&for=use_in_order`
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch promo code");
//       }

//       const data = await res.json();

//       if (data?.data?.data?.length > 0) {
//         const promo = data.data.data[0];

//         if (promo.status !== "Active") {
//           setPromoInfo(null);
//           toast.error("Promo code is not active");
//           return;
//         }

//         if (parseInt(promo.orders_count) >= parseInt(promo.usage_limit)) {
//           setPromoInfo(null);
//           toast.error("Promo code has reached its usage limit");
//           return;
//         }

//         const discountAmount =
//           promo.type === "fixed"
//             ? parseFloat(promo.amount)
//             : (parseFloat(promo.amount) / 100) * subtotal;

//         if (isNaN(discountAmount) || discountAmount <= 0) {
//           setPromoInfo(null);
//           toast.error("Invalid promo code amount");
//           return;
//         }

//         setPromoInfo(promo);
//         toast.success("Promo code applied!");
//       } else {
//         setPromoInfo(null);
//         toast.error("Invalid promo code");
//       }
//     } catch (error) {
//       console.error("Promo code fetch error:", error);
//       toast.error("Something went wrong while applying promo code");
//     }
//   };

//   const uaeStates = [
//     { value: "abudhabi", label: "Abu Dhabi" },
//     { value: "dubai", label: "Dubai" },
//     { value: "sharjah", label: "Sharjah" },
//     { value: "ajman", label: "Ajman" },
//     { value: "ummalquwain", label: "Umm Al-Quwain" },
//     { value: "rasalkhaimah", label: "Ras Al Khaimah" },
//     { value: "fujairah", label: "Fujairah" },
//   ];

//   // const getStatesForCountry = (country: string) => {
//   //   switch (country) {
//   //     // case "bangladesh":
//   //     //   return bangladeshStates;
//   //     // case "us":
//   //     //   return usStates;
//   //     // case "ca":
//   //     //   return canadaProvinces;
//   //     // case "uk":
//   //     //   return ukCountries;
//   //     case "ae":
//   //       return uaeStates;
//   //     default:
//   //       return []; // No states for other countries by default
//   // Grady = require("crypto");

//   // const generateUUID = () => {
//   //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//   //     const r = (Math.random() * 16) | 0;
//   //     const v = c === 'x' ? r : (r & 0x3) | 0x8;
//   //     return v.toString(16);
//   //   });
//   // };

//   // const currentStates = getStatesForCountry(formData.country);

//   return (
//     <div className="min-h-screen bg-[#F5E6D3]">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-8">{dict.checkout.title}</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2 bg-white p-6 rounded-lg">
//             <div className="space-y-6">
//               {/* Shipping Information */}
//               <div>
//                 <h2 className="text-xl font-semibold mb-4">
//                   {dict.checkout.shipping}
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="firstName">{dict.checkout.flname}</Label>
//                     <Input
//                       id="firstName"
//                       placeholder="John"
//                       value={formData.shipping_details.firstName}
//                       onChange={(e) =>
//                         handleInputChange("firstName", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                   {/* <div>
//                     <Label htmlFor="lastName">{dict.checkout.lsname}</Label>
//                     <Input
//                       id="lastName"
//                       placeholder="Doe"
//                       value={formData.lastName}
//                       onChange={(e) =>
//                         handleInputChange("lastName", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div> */}
//                   <div>
//                     <Label htmlFor="phone">{dict.checkout.phone}</Label>
//                     <Input
//                       id="phone"
//                       placeholder="01700000001"
//                       value={formData.shipping_details.phone}
//                       onChange={(e) =>
//                         handleInputChange("phone", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="email">{dict.checkout.email}</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="john@example.com"
//                       value={formData.shipping_details.email}
//                       onChange={(e) =>
//                         handleInputChange("email", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>

//                   <div className="col-span-2">
//                     <Label htmlFor="apartment">
//                       {dict.checkout.apartment}
//                     </Label>
//                     <Input
//                       id="apartment"
//                       placeholder="House 1, Road 1"
//                       value={formData.shipping_details.apartment}
//                       onChange={(e) =>
//                         handleInputChange("apartment", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>

//                   {/* <div>
//                     <Label htmlFor="city">{dict.checkout.city}</Label>
//                     <Input
//                       id="city"
//                       placeholder="abu dhabi"
//                       value={formData.city}
//                       onChange={(e) =>
//                         handleInputChange("city", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div> */}

//                   {/* <div className="col-span-1">
//                     <Label htmlFor="country">{dict.checkout.country}</Label>
//                     <Select
//                       value={formData.country}
//                       onValueChange={(value) =>
//                         handleInputChange("country", value)
//                       }
//                       disabled={isLoading}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="bangladesh">Bangladesh</SelectItem>
//                         <SelectItem value="us">United States</SelectItem>
//                         <SelectItem value="ca">Canada</SelectItem>
//                         <SelectItem value="uk">United Kingdom</SelectItem>
//                         <SelectItem value="ae">Arab Emirates (UAE)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div> */}

//                   <div>
//                     <Label htmlFor="state">{dict.checkout.state}</Label>
//                     <Select
//                       value={formData.shipping_details.state}
//                       onValueChange={(value) =>
//                         handleInputChange("state", value)
//                       }
//                       disabled={isLoading}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select state" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {uaeStates.map((state) => (
//                           <SelectItem key={state.value} value={state.value}>
//                             {state.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="postal">{dict.checkout.postal}</Label>
//                     <Input
//                       id="postal"
//                       placeholder="1205"
//                       value={formData.shipping_details.postal}
//                       onChange={(e) =>
//                         handleInputChange("postal", e.target.value)
//                       }
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Shipping Method */}
//               <div>
//                 <h2 className="text-xl font-semibold mb-4">{dict.checkout.method}</h2>
//                 <RadioGroup
//                   value={shippingMethod}
//                   onValueChange={setShippingMethod}
//                   disabled={isLoading}
//                 >
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="standard" id="standard" />
//                       <Label htmlFor="standard">
//                         Standard Shipping (5-7 business days)
//                       </Label>
//                     </div>
//                     <span className="font-semibold"><span className="text-[16px]">AED</span>  5.99</span>
//                   </div>
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="express" id="express" />
//                       <Label htmlFor="express">
//                         Express Shipping (2-3 business days)
//                       </Label>
//                     </div>
//                     <span className="font-semibold"><span className="text-[16px]">AED</span> 12.99</span>
//                   </div>
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="overnight" id="overnight" />
//                       <Label htmlFor="overnight">
//                         Overnight Shipping (1 business day)
//                       </Label>
//                     </div>
//                     <span className="font-semibold"><span className="text-[16px]">AED</span>  24.99</span>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Error Display */}
//               {(createOrderMutation.error || createCheckoutMutation.error) && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-600 text-sm">
//                     {createOrderMutation.error?.message ||
//                       createCheckoutMutation.error?.message}
//                   </p>
//                 </div>
//               )}

//               <Button
//                 onClick={handlePayment}
//                 disabled={isLoading}
//                 className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     <span>Processing...</span>
//                   </div>
//                 ) : (
//                   "Payment →"
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white p-6 rounded-lg h-fit">
//             <h2 className="text-xl font-semibold mb-4">{dict.checkout.summary}</h2>

//             <div className="space-y-4 mb-6">
//               {items.map((item) => (
//                 <div key={item.id} className="flex items-center space-x-3">
//                   <Image
//                     src={
//                       item?.media?.[0]?.file_path
//                         ? `${item?.media[0]?.file_path}`
//                         : "/placeholder.svg"
//                     }
//                     alt={item?.name || "Image"}
//                     width={100}
//                     height={100}
//                     className="rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       Quantity: {item.quantity}
//                     </p>
//                   </div>
//                   <span className="font-semibold"><span className="text-[16px]">AED</span> {item.price}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-2 border-t pt-4">
//               <div className="flex justify-between">
//                 <span>{dict.checkout.total}</span>
//                 <span><span className="text-[16px]">AED</span> {subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>{dict.checkout.shipping}</span>
//                 <span><span className="text-[16px]">AED</span> {shipping.toFixed(2)}</span>
//               </div>
//               <div>
//                 <Label htmlFor="promo">{dict.checkout.promo}</Label>
//                 <Input
//                   placeholder="FREESHIP"
//                   value={formData.promo}
//                   onChange={(e) => handleInputChange("promo", e.target.value)}
//                   className="mb-2"
//                   id="promo"
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="flex items-center justify-center py-2">
//                 <button
//                   onClick={handleUsePromoCode}
//                   className="bg-black text-white py-2 px-2 w-full hover:bg-gray-700 rounded-lg"
//                   disabled={isLoading}
//                 >
//                   {dict.checkout.redeem}
//                 </button>
//               </div>
//               {promoInfo && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Promo ({formData.promo})</span>
//                   <span>-<span className="text-[16px]">AED</span> {discount.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-lg border-t pt-2">
//                 <span>{dict.checkout.total}</span>
//                 <span><span className="text-[16px]">AED</span> {total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCheckoutSession, OrderData } from "@/types/order";
import Image from "next/image";
import { DictionaryType } from "@/dictionaries/dictionaries";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ShippingDetails {
  firstName: string;
  email: string;
  phone: string;
  apartment: string;
  state: string;
  postal: string;
  country:string
}

interface FormData {
  shipping_details: ShippingDetails;
  promo: string;
  // lastName: string;
  // city: string;
  // country: string;
}

interface PromoInfo {
  id: number;
  name: string;
  description: string;
  type: "fixed" | "percentage";
  status: "Active" | "inactive";
  usage_limit: string;
  amount: string;
  created_at: string;
  updated_at: string;
  orders_count: number;
}

interface Props {
  dict: DictionaryType
}

export default function CheckoutPage({ dict }: Props) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [shippingMethod, setShippingMethod] = useState("standard");
     const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    shipping_details: {
      firstName: "",
      email: "",
      phone: "",
      apartment: "",
      state: "",
      postal: "",
      country:"",
    },
    promo: "",
    // lastName: "",
    // city: "",
    // country: "",
  });
  const [promoInfo, setPromoInfo] = useState<PromoInfo | null>(null);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token || "";
  const subtotal = getTotalPrice();
  const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99,
  };
  const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts];

  const discount =
    promoInfo && promoInfo.status === "Active"
      ? promoInfo.type === "fixed"
        ? parseFloat(promoInfo.amount)
        : (parseFloat(promoInfo.amount) / 100) * subtotal
      : 0;

  const total = Math.max(0, subtotal + shipping - discount);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "{{url}}";

  const createCheckoutMutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (checkoutResponse) => {
      if (
        checkoutResponse.status === "success" &&
        checkoutResponse.checkout_url
      ) {
        clearCart();
        window.location.href = checkoutResponse.checkout_url;
      } else {
        toast.error("Failed to create checkout session");
      }
    },
    onError: (error) => {
      console.error("Checkout Error:", error);
      toast.error(`Failed to create checkout session: ${error.message}`);
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderData) => {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create order: ${response.status}`
        );
      }

      return response.json();
    },
    onSuccess: (orderResponse) => {
    //  console.log()
      createCheckoutMutation.mutate({
        order_id: orderResponse?.data?.data?._id,
        token:token
        // email: formData.shipping_details.email,
      });
    },
    onError: (error) => {
      console.error("❌ Order Creation Failed:", error);
      toast.error(`Failed to create order: ${error.message}`);
    },
  });

  const handleInputChange = (field: keyof FormData | keyof ShippingDetails, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev };
      if (field === "promo") {
        newState[field] = value;
      } else {
        newState.shipping_details = {
          ...prev.shipping_details,
          [field]: value,
        };
      }
      // Reset state if country changes, to avoid invalid state selection
      // if (field === "country" && prev.country !== value) {
      //   newState.shipping_details.state = "";
      // }
      return newState;
    });
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof ShippingDetails)[] = [
      "firstName",
      "email",
      "phone",
      "state",
      "postal",
      // "lastName",
      // "city",
      "country",
    ];

    for (const field of requiredFields) {
      if (!formData.shipping_details[field].trim()) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.shipping_details.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    return true;
  };

  const handlePayment = () => {
    if(!token){
      router.push("/login")
    }
    if (!validateForm()) return;

    const orderData: OrderData = {
      shipping_details: {
        firstName: formData.shipping_details.firstName,
        email: formData.shipping_details.email,
        phone: formData.shipping_details.phone,
        // apartment: formData.shipping_details.apartment,
        state: formData.shipping_details.state,
        postal: formData.shipping_details.postal,
        country:formData.shipping_details.country
        
      },
      type: "online",
      items: items.length.toString(),
      status: "pending",
      shipping_method: shippingMethod,
      shipping_price: shipping.toString(),
      order_summary: items
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", "),
      payment_method: "cash_on_delivery",
      payment_status: "unpaid",
      promocode_id: promoInfo?.id?.toString(),
      total: total.toString(),
      products: items.map((item) => ({
        product_id: item.id.toString(),
        quantity: item.quantity.toString(),
      })),
      promocode_name: formData.promo || undefined,
    };

    createOrderMutation.mutate(orderData);
  };

  const isLoading =
    createOrderMutation.isPending || createCheckoutMutation.isPending;

  const handleUsePromoCode = async () => {
    if (!formData.promo) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/promocodes?search=${formData.promo}&for=use_in_order`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch promo code");
      }

      const data = await res.json();

      if (data?.data?.data?.length > 0) {
        const promo = data.data.data[0];

        if (promo.status !== "Active") {
          setPromoInfo(null);
          toast.error("Promo code is not active");
          return;
        }

        if (parseInt(promo.orders_count) >= parseInt(promo.usage_limit)) {
          setPromoInfo(null);
          toast.error("Promo code has reached its usage limit");
          return;
        }

        const discountAmount =
          promo.type === "fixed"
            ? parseFloat(promo.amount)
            : (parseFloat(promo.amount) / 100) * subtotal;

        if (isNaN(discountAmount) || discountAmount <= 0) {
          setPromoInfo(null);
          toast.error("Invalid promo code amount");
          return;
        }

        setPromoInfo(promo);
        toast.success("Promo code applied!");
      } else {
        setPromoInfo(null);
        toast.error("Invalid promo code");
      }
    } catch (error) {
      console.error("Promo code fetch error:", error);
      toast.error("Something went wrong while applying promo code");
    }
  };

  const uaeStates = [
    { value: "abudhabi", label: "Abu Dhabi" },
    { value: "dubai", label: "Dubai" },
    { value: "sharjah", label: "Sharjah" },
    { value: "ajman", label: "Ajman" },
    { value: "ummalquwain", label: "Umm Al-Quwain" },
    { value: "rasalkhaimah", label: "Ras Al Khaimah" },
    { value: "fujairah", label: "Fujairah" },
  ];

  // const getStatesForCountry = (country: string) => {
  //   switch (country) {
  //     // case "bangladesh":
  //     //   return bangladeshStates;
  //     // case "us":
  //     //   return usStates;
  //     // case "ca":
  //     //   return canadaProvinces;
  //     // case "uk":
  //     //   return ukCountries;
  //     case "ae":
  //       return uaeStates;
  //     default:
  //       return []; // No states for other countries by default
  //   }
  // };

  // const currentStates = getStatesForCountry(formData.country);

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{dict.checkout.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg">
            <div className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {dict.checkout.shipping}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{dict.checkout.flname}</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.shipping_details.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="lastName">{dict.checkout.lsname}</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div> */}
                  <div>
                    <Label htmlFor="phone">{dict.checkout.phone}</Label>
                    <Input
                      id="phone"
                      placeholder="01700000001"
                      value={formData.shipping_details.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{dict.checkout.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.shipping_details.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  {/* <div className="col-span-2">
                    <Label htmlFor="apartment">
                      {dict.checkout.apartment}
                    </Label>
                    <Input
                      id="apartment"
                      placeholder="House 1, Road 1"
                      value={formData.shipping_details.apartment}
                      onChange={(e) =>
                        handleInputChange("apartment", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div> */}

                  {/* <div>
                    <Label htmlFor="city">{dict.checkout.city}</Label>
                    <Input
                      id="city"
                      placeholder="abu dhabi"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div> */}

                  <div className="col-span-1">
                    <Label htmlFor="country">{dict.checkout.country}</Label>
                    <Select
                      value={formData.shipping_details.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem> */}
                        <SelectItem value="ae">Arab Emirates (UAE)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="state">{dict.checkout.state}</Label>
                    <Select
                      value={formData.shipping_details.state}
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {uaeStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postal">{dict.checkout.postal}</Label>
                    <Input
                      id="postal"
                      placeholder="1205"
                      value={formData.shipping_details.postal}
                      onChange={(e) =>
                        handleInputChange("postal", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h2 className="text-xl font-semibold mb-4">{dict.checkout.method}</h2>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">
                        Standard Shipping (5-7 business days)
                      </Label>
                    </div>
                    <span className="font-semibold"><span className="text-[16px]">AED</span>  5.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express">
                        Express Shipping (2-3 business days)
                      </Label>
                    </div>
                    <span className="font-semibold"><span className="text-[16px]">AED</span> 12.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label htmlFor="overnight">
                        Overnight Shipping (1 business day)
                      </Label>
                    </div>
                    <span className="font-semibold"><span className="text-[16px]">AED</span>  24.99</span>
                  </div>
                </RadioGroup>
              </div>

              {/* Error Display */}
              {(createOrderMutation.error || createCheckoutMutation.error) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    {createOrderMutation.error?.message ||
                      createCheckoutMutation.error?.message}
                  </p>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Payment →"
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg h-fit">
            <h2 className="text-xl font-semibold mb-4">{dict.checkout.summary}</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <Image
                    src={
                      item?.media?.[0]?.file_path
                        ? `${item?.media[0]?.file_path}`
                        : "/placeholder.svg"
                    }
                    alt={item?.name || "Image"}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold"><span className="text-[16px]">AED</span> {item.price}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>{dict.checkout.total}</span>
                <span><span className="text-[16px]">AED</span> {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{dict.checkout.shipping}</span>
                <span><span className="text-[16px]">AED</span> {shipping.toFixed(2)}</span>
              </div>
              <div>
                <Label htmlFor="promo">{dict.checkout.promo}</Label>
                <Input
                  placeholder="FREESHIP"
                  value={formData.promo}
                  onChange={(e) => handleInputChange("promo", e.target.value)}
                  className="mb-2"
                  id="promo"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-center py-2">
                <button
                  onClick={handleUsePromoCode}
                  className="bg-black text-white py-2 px-2 w-full hover:bg-gray-700 rounded-lg"
                  disabled={isLoading}
                >
                  {dict.checkout.redeem}
                </button>
              </div>
              {promoInfo && (
                <div className="flex justify-between text-green-600">
                  <span>Promo ({formData.promo})</span>
                  <span>-<span className="text-[16px]">AED</span> {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>{dict.checkout.total}</span>
                <span><span className="text-[16px]">AED</span> {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}