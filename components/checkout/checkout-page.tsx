"use client";

import { useState } from "react";
import Image from "next/image";
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
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = getTotalPrice();

  const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99,
  };
  const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts];
  const total = subtotal + shipping;

  const handlePayment = () => {
    // Simulate payment processing
    const success = Math.random() > 0.3; // 70% success rate
    clearCart();

    if (success) {
      router.push("/payment/success");
    } else {
      router.push("/payment/canceled");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg">
            <div className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Full name</Label>
                    <Input id="firstName" placeholder="" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="apartment">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input id="apartment" placeholder="" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="" />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input id="postal" placeholder="" />
                  </div>
                  <div>
                    <Label htmlFor="promo">Promo</Label>
                    <Input
                      placeholder="Promo Code"
                      // onChange={}
                      className="mb-2"
                      id="promo" 
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="country">Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">
                        Standard Shipping (5-7 business days)
                      </Label>
                    </div>
                    <span className="font-semibold">$5.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express">
                        Express Shipping (2-3 business days)
                      </Label>
                    </div>
                    <span className="font-semibold">$12.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label htmlFor="overnight">
                        Overnight Shipping (1 business day)
                      </Label>
                    </div>
                    <span className="font-semibold">$24.99</span>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Payment →
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
