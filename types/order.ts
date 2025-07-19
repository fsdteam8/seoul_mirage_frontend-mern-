// API functions for orders and checkout
export interface OrderData {
  full_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  full_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  type: string;
  items: string;
  status: string;
  shipping_method: string;
  shipping_price: string;
  order_summary: string;
  payment_method: string;
  payment_status: string;
  promocode_id?: string;
  total: string;
  products: Array<{
    product_id: string;
    quantity: string;
  }>;
  shipping_details: {
    firstName: string
    email: string
    phone: string,
    country:string
    apartment?: string
    state: string
    postal: string
  }
  promocode_name?: string;
}

export interface OrderResponse {
  id: number;
  // Add other response fields as needed
}

export interface CheckoutData {
  order_id: number;
  // email: string;
  token: string
}

export interface CheckoutResponse {
  status: string;
  checkout_url: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "{{url}}";

export async function createOrder(
  orderData: OrderData
): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
}

export async function createCheckoutSession(
  checkoutData: CheckoutData
): Promise<CheckoutResponse> {

  const response = await fetch(`${API_BASE_URL}/api/stripe/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${checkoutData?.token}`,


    },
    body: JSON.stringify({ order_id: checkoutData?.order_id }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
      `Failed to create checkout session: ${response.status}`
    );
  }

  return response.json();
}
