import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import CardContent from '../../components/ui/CardContent';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Label from '../../components/ui/Lable';
import Input from '../../components/ui/Input';
import { authService } from '../../services/AuthService';

const ForgotPasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h2>
          <p className="text-sm text-gray-500">Đừng lo, chúng tôi sẽ gửi hướng dẫn cho bạn.</p>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Đã gửi email!</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                Vui lòng kiểm tra hộp thư đến (và cả mục spam) để lấy đường dẫn đặt lại mật khẩu.
              </p>
              <Link to="/login">
                <Button variant="ghost" className="w-full">Quay lại đăng nhập</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email đăng ký</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    {...register("email", { required: true })}
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="ghost" className="w-full" isLoading={loading}>
                Gửi link khôi phục
              </Button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 flex items-center justify-center gap-1">
                  <ArrowLeft size={16} /> Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage