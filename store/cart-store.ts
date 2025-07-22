// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// // Product types
// export interface Media {
//   id: number;
//   product_id: number;
//   file_path: string;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface Category {
//   id: number;
//   name: string;
// }

// export interface Product {
//   id: number;
//   arrival_status?: string;
//   name: string;
//   description: string;
//   image: string | null;
//   price: string;
//   category_id: number;
//   status: "active" | "inactive";
//   cost_price: string;
//   stock_quantity: number;
//   sales: number;
//   created_at: string;
//   updated_at: string;
//   category: Category;
//   media: Media[];
//   images?: string[];
//   reviews_avg_rating?: number | string;
//   reviews_count?: number | string;
// }

// export interface CartItem extends Product {
//   quantity: number;
// }

// // Store type
// interface CartStore {
//   items: CartItem[];
//   addItem: (product: CartItem) => void;
//   removeItem: (productId: number) => void;
//   updateQuantity: (productId: number, quantity: number) => void;
//   clearCart: () => void;
//   getTotalItems: () => number;
//   getTotalPrice: () => number;
// }

// // Zustand store
// export const useCartStore = create<CartStore>()(
//   persist(
//     (set, get) => ({
//       items: [],

//       // ✅ Add item with quantity support
//       addItem: (product) =>
//         set((state) => {
//           const existing = state.items.find((item) => item.id === product.id);
//           if (existing) {
//             return {
//               items: state.items.map((item) =>
//                 item.id === product.id
//                   ? { ...item, quantity: item.quantity + product.quantity }
//                   : item
//               ),
//             };
//           }
//           return {
//             items: [...state.items, { ...product }],
//           };
//         }),

//       // ✅ Remove item
//       removeItem: (productId) =>
//         set((state) => ({
//           items: state.items.filter((item) => item.id !== productId),
//         })),

//       // ✅ Update item quantity
//       updateQuantity: (productId, quantity) =>
//         set((state) => ({
//           items: state.items.map((item) =>
//             item.id === productId
//               ? { ...item, quantity: quantity > 0 ? quantity : 1 }
//               : item
//           ),
//         })),

//       // ✅ Clear cart
//       clearCart: () => set({ items: [] }),

//       // ✅ Get total items count
//       getTotalItems: () =>
//         get().items.reduce((total, item) => total + item.quantity, 0),

//       // ✅ Get total cart price
//       getTotalPrice: () =>
//         get().items.reduce((total, item) => {
//           const price = parseFloat(item.price);
//           return total + (isNaN(price) ? 0 : price * item.quantity);
//         }, 0),
//     }),
//     {
//       name: "cart-storage", // Key for localStorage
//     }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Product types
export interface Media {
  id: number;
  product_id: number;
  file_path: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number | string;
  name: string;
}

export interface Product {
  id: number | string;
  arrival_status?: string;
  name: string;
  description?: string;
  createdAt?: string | number | Date
  image: string | null;
  price: number | string;
  category_id?: number;
  status?: "active" | "inactive";
  cost_price?: string;
  stock_quantity?: number;
  sales?: number;
  created_at?: string;
  updated_at?: string;
  category: Category;
  media?: Media[];
  images?: string[];
  reviews_avg_rating?: number | string;
  reviews_count?: number | string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + product.quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { ...product }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: quantity > 0 ? quantity : 1 }
              : item
          ),
        })),

        
      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => {
          const price =
            typeof item.price === "number"
              ? item.price
              : parseFloat(item.price);
          return total + (isNaN(price) ? 0 : price * item.quantity);
        }, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);
