export interface LargeSizeProtectionConfig {
  threshold: number;       // e.g. 0.70
  surcharge: number;       // e.g. 2000 (COP per large-size item)
  large_size_codes: string[]; // e.g. ['XL', 'XXL', '2XL', ...]
}

export interface OrderRules {
  large_size_protection: LargeSizeProtectionConfig;
}
