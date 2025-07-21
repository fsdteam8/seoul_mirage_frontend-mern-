// export interface SearchProduct {
//     id: number;
//     name: string;
//     description: string;
//     image: string | null;
//     price: string;
//     category_id: number;
//     status: string;
//     cost_price: string;
//     stock_quantity: number;
//     sales: number;
//     created_at: string;
//     updated_at: string;
//     media: Array<{
//       id: number;
//       product_id: number;
//       file_path: string;
//       created_at: string;
//       updated_at: string;
//     }>;
//     category: {
//       id: number;
//       name: string;
//     };
//   }
  
//   export interface SearchResponse {
//     success: boolean;
//     data: {
//       current_page: number;
//       data: SearchProduct[];
//       first_page_url: string;
//       from: number;
//       last_page: number;
//       last_page_url: string;
//       links: Array<{
//         url: string | null;
//         label: string;
//         active: boolean;
//       }>;
//       next_page_url: string | null;
//       path: string;
//       per_page: number;
//       prev_page_url: string | null;
//       to: number;
//       total: number;
//     };
//     current_page: number;
//     total_pages: number;
//     per_page: number;
//     total: number;
//   }

export interface SearchProduct {
  id: number;
  _id: string; // MongoDB-style ID
  name: string;
  description: string;
  image: string | null;
  price: string;
  cost_price: string;
  stock_quantity: number;
  sales: number;
  status: string;
  arrival_status: string;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  reviews_avg_rating: number;
  reviews_count: number;
  rating?: number; // Optional (seen in some objects)
  total_review?: number; // Optional (seen in some objects)

  media: Array<{
    _id: string;
    file_path: string;
    alt: string;
    order: number;
  }>;

  category: {
    _id: string;
    name: string;
  };
}


export interface SearchResponse {
  message: string;
  data: {
    success: boolean;
    data: SearchProduct[];
    params: {
      search?: string;
      paginate_count?: string;
    };
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number;
      to: number;
      links:[]; // Empty array in your case; replace `any` with proper type if links are used in future
    };
  };
}