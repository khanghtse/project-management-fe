import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import CardContent from '../../components/ui/CardContent';
import Label from '../../components/ui/Lable';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Lấy param từ URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authService.login(formData.email, formData.password);
      localStorage.setItem('accessToken', data.accessToken);
      // --- LOGIC MỚI: KIỂM TRA RETURN URL ---
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        // Nếu có returnUrl (ví dụ từ trang accept-invite), giải mã và điều hướng tới đó
        navigate(decodeURIComponent(returnUrl));
      } else {
        // Nếu không, về trang chủ như bình thường
        navigate('/');
      }
      toast.success('Đăng nhập thành công');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Đăng nhập</h2>
          <p className="text-gray-500">Nhập email của bạn để truy cập quản lý dự án</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full text-black cursor-pointer hover:bg-gray-100" isLoading={loading}>
              Đăng nhập
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span></div>
          </div>

          <Button variant="outline" className="w-full cursor-pointer" onClick={authService.loginWithGoogle}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          
          <div className="mt-4 text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;