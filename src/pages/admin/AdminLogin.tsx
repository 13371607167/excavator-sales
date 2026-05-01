import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useStore } from '@/store';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/admin/products');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate('/admin/products');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-600 to-dark-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark-600">管理后台登录</h1>
            <p className="text-dark-400 mt-2">请输入管理员账号密码</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-accent-red flex-shrink-0" />
                <p className="text-accent-red text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">用户名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full pl-12 pr-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              登录
            </button>
          </form>

          <div className="mt-6 p-4 bg-dark-100 rounded-lg">
            <p className="text-sm text-dark-400 text-center">
              默认账号: <span className="font-medium text-dark-600">admin</span>
              <br />
              默认密码: <span className="font-medium text-dark-600">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
