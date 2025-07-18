export interface ProductResponse {
  success: boolean;
  data: PaginatedProducts;
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}

export interface PaginatedProducts {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  arrival_status?:string
  description: string;
  image: string | null;
  price: string;
  category_id: number;
  status: 'active' | 'inactive'; // Add other status values if needed
  cost_price: string;
  stock_quantity: number;
  sales: number;
  created_at: string;
  updated_at: string;
  media: Media[];
  category: Category;
}

export interface Media {
  id: number;
  product_id: number;
  file_path: string;
}

export interface Category {
  id: number;
  name: string;
}
