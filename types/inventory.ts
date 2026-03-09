export interface Inventory {
  id: number;
  product_variant_id: number;
  store_id: number;
  quantity_available: number;
  quantity_reserved: number;
  quantity_in_transit: number;
  min_quantity: number | null;
  max_quantity: number | null;
  reorder_point: number;
  location: string | null;
  last_restock_date: string | null;
  last_sale_date: string | null;
  last_inventory_check_date: string;
  created_at: string;
  updated_at: string;
}

export interface CombinationData {
  variant_id: number;
  stock: number;
}