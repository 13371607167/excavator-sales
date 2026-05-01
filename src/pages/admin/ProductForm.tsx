import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '@/store';
import type { Product, Category, ProductStatus, PriceType } from '@/types';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products, addProduct, updateProduct, isAuthenticated } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEdit = Boolean(id);
  const existingProduct = isEdit ? products.find((p) => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    category: 'excavator' as Category,
    description: '',
    images: [] as string[],
    price: '',
    priceType: 'fixed' as PriceType,
    status: 'available' as ProductStatus,
    brand: '',
    model: '',
    year: '',
    hours: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    if (isEdit && existingProduct) {
      setFormData({
        name: existingProduct.name,
        category: existingProduct.category,
        description: existingProduct.description,
        images: existingProduct.images,
        price: existingProduct.price?.toString() || '',
        priceType: existingProduct.priceType,
        status: existingProduct.status,
        brand: existingProduct.specifications.brand || '',
        model: existingProduct.specifications.model || '',
        year: existingProduct.specifications.year?.toString() || '',
        hours: existingProduct.specifications.hours?.toString() || '',
      });
    }
  }, [isAuthenticated, isEdit, existingProduct, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, base64],
        }));
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入产品名称';
    }
    if (!formData.description.trim()) {
      newErrors.description = '请输入产品描述';
    }
    if (formData.images.length === 0) {
      newErrors.images = '请至少上传一张产品图片';
    }
    if (formData.priceType === 'fixed' && !formData.price) {
      newErrors.price = '请输入产品价格';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      images: formData.images,
      price: formData.priceType === 'fixed' ? parseInt(formData.price) : null,
      priceType: formData.priceType,
      status: formData.status,
      specifications: {
        brand: formData.brand.trim() || undefined,
        model: formData.model.trim() || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        hours: formData.hours ? parseInt(formData.hours) : undefined,
      },
    };

    if (isEdit && id) {
      updateProduct(id, productData);
    } else {
      addProduct(productData);
    }

    navigate('/admin/products');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-dark-500 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
            <h1 className="flex-1 text-center font-bold text-dark-600">
              {isEdit ? '编辑产品' : '添加产品'}
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-dark-600 mb-4">基本信息</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">
                  产品名称 <span className="text-accent-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：小松PC200-8挖掘机"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-accent-red' : 'border-dark-200'
                  }`}
                />
                {errors.name && <p className="text-accent-red text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">产品分类</label>
                <div className="flex gap-2">
                  {[
                    { value: 'excavator', label: '挖掘机' },
                    { value: 'parts', label: '配件' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: option.value as Category })}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                        formData.category === option.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-100 text-dark-500 hover:bg-dark-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">
                  产品描述 <span className="text-accent-red">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请详细描述产品信息，如工况、配置等..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                    errors.description ? 'border-accent-red' : 'border-dark-200'
                  }`}
                />
                {errors.description && <p className="text-accent-red text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-dark-600 mb-4">产品图片</h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-dark-100 rounded-lg overflow-hidden group">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-accent-red text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label className="aspect-square bg-dark-100 rounded-lg border-2 border-dashed border-dark-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                <Upload size={24} className="text-dark-300" />
                <span className="text-xs text-dark-400 mt-1">上传图片</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {errors.images && <p className="text-accent-red text-sm">{errors.images}</p>}
            <p className="text-xs text-dark-400">支持 JPG、PNG 格式，可上传多张图片</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-dark-600 mb-4">价格与状态</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">价格类型</label>
                <div className="flex gap-2">
                  {[
                    { value: 'fixed', label: '固定价格' },
                    { value: 'negotiable', label: '价格面议' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priceType: option.value as PriceType })}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                        formData.priceType === option.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-100 text-dark-500 hover:bg-dark-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.priceType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    价格 (元) <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="请输入价格"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.price ? 'border-accent-red' : 'border-dark-200'
                    }`}
                  />
                  {errors.price && <p className="text-accent-red text-sm mt-1">{errors.price}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">销售状态</label>
                <div className="flex gap-2">
                  {[
                    { value: 'available', label: '在售' },
                    { value: 'sold', label: '已售' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: option.value as ProductStatus })}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                        formData.status === option.value
                          ? formData.status === 'available'
                            ? 'bg-accent-green text-white'
                            : 'bg-accent-red text-white'
                          : 'bg-dark-100 text-dark-500 hover:bg-dark-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-dark-600 mb-4">产品规格 (可选)</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">品牌</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="例如：小松"
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">型号</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="例如：PC200-8"
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">年份</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="例如：2019"
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">工作小时</label>
                <input
                  type="number"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="例如：3500"
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-dark-200 rounded-lg text-dark-500 hover:bg-dark-50 transition-colors font-medium"
            >
              取消
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {isEdit ? '保存修改' : '发布产品'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
