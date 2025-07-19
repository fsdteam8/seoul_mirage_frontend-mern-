"use client";

interface ShippingInformationProps {
  // subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function ShippingInformation({
  // subtotal,
  // discount,
  shipping,
  tax,
  total,
}: ShippingInformationProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Shipping Information
      </h2>
      <div className="space-y-3">
        {/* <div className="flex justify-between">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div> */}
        {/* <div className="flex justify-between">
          <span className="text-green-600">Discount (30%)</span>
          <span className="text-green-600 font-medium">
            -${discount.toFixed(2)}
          </span>
        </div> */}
        <div className="flex justify-between">
          <span className="text-gray-700">Shipping</span>
          <span className="font-medium">AED {shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">TAX</span>
          <span className="font-medium">AED {tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              AED {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
