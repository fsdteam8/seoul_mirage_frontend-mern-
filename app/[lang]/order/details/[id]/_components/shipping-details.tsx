"use client";

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  apartment: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingDetailsProps {
  address: ShippingAddress;
  shippingMethod: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export default function ShippingDetails({
  address,
  shippingMethod,
  trackingNumber,
  estimatedDelivery,
}: ShippingDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Shipping Address */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Shipping Address
        </h2>
        <div className="space-y-1 text-gray-700">
          <p className="font-medium">{address.name}</p>
          <p>{address.email}</p>
          <p>{address.phone}</p>
          <p>{address.apartment}</p>
          <p>{address.street}</p>
          <p>
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p>{address.country}</p>
        </div>
      </div>

      {/* Shipping Method */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Shipping Method
        </h2>
        <p className="text-gray-700">{shippingMethod}</p>
      </div>

      {/* Tracking Information */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Tracking Information
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Tracking Number:</span>
            <span className="font-medium text-gray-900">{trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Estimated Delivery:</span>
            <span className="font-medium text-gray-900">
              {estimatedDelivery}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
