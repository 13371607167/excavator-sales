import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ContactInfo } from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialProducts: Product[] = [
  {
    id: generateId(),
    name: '小松PC200-8挖掘机',
    category: 'excavator',
    description: '小松PC200-8挖掘机，工况良好，发动机动力强劲，液压系统稳定。外观整洁，无大修记录。适合土方工程、基础施工等作业。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yellow%20komatsu%20excavator%20PC200-8%20on%20construction%20site%2C%20professional%20machinery%20photography%2C%20sunny%20day&image_size=landscape_16_9'
    ],
    price: 280000,
    priceType: 'fixed',
    status: 'available',
    specifications: {
      brand: '小松',
      model: 'PC200-8',
      year: 2019,
      hours: 3500
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: '卡特320D挖掘机',
    category: 'excavator',
    description: '卡特彼勒320D挖掘机，经典机型，性能稳定。原装进口发动机，油耗低，效率高。整车原版原漆，欢迎实地看机。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yellow%20caterpillar%20excavator%20320D%20on%20construction%20site%2C%20professional%20machinery%20photography&image_size=landscape_16_9'
    ],
    price: null,
    priceType: 'negotiable',
    status: 'available',
    specifications: {
      brand: '卡特彼勒',
      model: '320D',
      year: 2018,
      hours: 5200
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: '斗山DX215挖掘机',
    category: 'excavator',
    description: '斗山DX215挖掘机，已售出。感谢客户信任！',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=orange%20doosan%20excavator%20DX215%20professional%20machinery%20photography&image_size=landscape_16_9'
    ],
    price: 195000,
    priceType: 'fixed',
    status: 'sold',
    specifications: {
      brand: '斗山',
      model: 'DX215',
      year: 2017,
      hours: 6800
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: '液压油缸总成',
    category: 'parts',
    description: '原装液压油缸总成，适用于小松PC200系列，品质保证，现货供应。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hydraulic%20cylinder%20for%20excavator%2C%20industrial%20parts%2C%20metallic%20finish%2C%20professional%20product%20photography&image_size=landscape_16_9'
    ],
    price: 8500,
    priceType: 'fixed',
    status: 'available',
    specifications: {
      brand: '小松',
      model: 'PC200系列通用'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: '挖掘机斗齿',
    category: 'parts',
    description: '高强度合金斗齿，耐磨耐用，适用于各类挖掘机。价格面议，量大从优。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=excavator%20bucket%20teeth%2C%20heavy%20duty%20metal%20parts%2C%20industrial%20photography&image_size=landscape_16_9'
    ],
    price: null,
    priceType: 'negotiable',
    status: 'available',
    specifications: {
      brand: '通用型',
      model: '多型号可选'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: '三一SY215C挖掘机',
    category: 'excavator',
    description: '三一重工SY215C挖掘机，国产精品，性价比高。配备三一自主研发发动机，动力强劲，操作舒适。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=orange%20sany%20excavator%20SY215C%20on%20construction%20site%2C%20professional%20machinery%20photography&image_size=landscape_16_9'
    ],
    price: 168000,
    priceType: 'fixed',
    status: 'available',
    specifications: {
      brand: '三一重工',
      model: 'SY215C',
      year: 2020,
      hours: 2800
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialContact: ContactInfo = {
  phone: '138-0000-0000',
  wechat: 'excavator_sales',
  address: 'XX省XX市XX区工程机械城A区88号',
  businessHours: '周一至周日 8:00-18:00'
};

interface AppState {
  products: Product[];
  contact: ContactInfo;
  isAuthenticated: boolean;
  
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  updateContact: (contact: Partial<ContactInfo>) => void;
  
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      contact: initialContact,
      isAuthenticated: false,

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          products: [newProduct, ...state.products]
        }));
      },

      updateProduct: (id, product) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, ...product, updatedAt: new Date().toISOString() }
              : p
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));
      },

      updateContact: (contact) => {
        set((state) => ({
          contact: { ...state.contact, ...contact }
        }));
      },

      login: (username, password) => {
        if (username === 'admin' && password === 'admin123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      }
    }),
    {
      name: 'excavator-storage'
    }
  )
);
