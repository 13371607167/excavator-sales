export interface Product {
  id: string;
  name: string;
  category: 'excavator' | 'parts';
  description: string;
  images: string[];
  price: number | null;
  priceType: 'fixed' | 'negotiable';
  status: 'available' | 'sold';
  specifications: {
    brand?: string;
    model?: string;
    year?: number;
    hours?: number;
    [key: string]: string | number | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phone: string;
  wechat: string;
  address: string;
  businessHours: string;
}

export interface Admin {
  username: string;
  password: string;
}

export type ProductStatus = 'available' | 'sold';
export type PriceType = 'fixed' | 'negotiable';
export type Category = 'excavator' | 'parts';
