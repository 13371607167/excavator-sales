import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Save, Check } from 'lucide-react';
import { useStore } from '@/store';

export default function AdminContact() {
  const navigate = useNavigate();
  const { contact, updateContact, isAuthenticated } = useStore();
  
  const [formData, setFormData] = useState({
    phone: '',
    wechat: '',
    address: '',
    businessHours: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    setFormData({
      phone: contact.phone,
      wechat: contact.wechat,
      address: contact.address,
      businessHours: contact.businessHours,
    });
  }, [isAuthenticated, contact, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateContact({
      phone: formData.phone.trim(),
      wechat: formData.wechat.trim(),
      address: formData.address.trim(),
      businessHours: formData.businessHours.trim(),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
              onClick={() => navigate('/admin/products')}
              className="flex items-center gap-2 text-dark-500 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
            <h1 className="flex-1 text-center font-bold text-dark-600">联系方式管理</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-dark-600 mb-6">联系信息</h2>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-500 mb-2">
                  <Phone size={16} />
                  联系电话
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="例如：138-0000-0000"
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-500 mb-2">
                  <MessageCircle size={16} />
                  微信号
                </label>
                <input
                  type="text"
                  value={formData.wechat}
                  onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
                  placeholder="请输入微信号"
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-500 mb-2">
                  <MapPin size={16} />
                  公司地址
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="请输入公司地址"
                  rows={2}
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-500 mb-2">
                  <Clock size={16} />
                  营业时间
                </label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  placeholder="例如：周一至周日 8:00-18:00"
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              saved
                ? 'bg-accent-green text-white'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {saved ? (
              <>
                <Check size={20} />
                已保存
              </>
            ) : (
              <>
                <Save size={20} />
                保存设置
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
