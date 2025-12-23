import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import CardContent from '../../components/ui/CardContent';
import { AlertCircle, Lock, Mail, User } from 'lucide-react';
import Label from '../../components/ui/Lable';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData.name, formData.email, formData.password);
      navigate('/login');
      toast.success('Đăng ký thành công');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tạo tài khoản</h2>
          <p className="text-gray-500">Bắt đầu quản lý dự án của bạn ngay hôm nay</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="name" name="name" placeholder="Nguyễn Văn A" className="pl-10" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <Button type="submit" className="w-full text-black cursor-pointer hover:bg-gray-100" isLoading={loading}>Đăng ký</Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
              Đăng nhập ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;