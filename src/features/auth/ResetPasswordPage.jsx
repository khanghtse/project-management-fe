import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import CardHeader from '../../components/ui/CardHeader';
import CardContent from '../../components/ui/CardContent';
import { CheckCircle, Lock } from 'lucide-react';
import Label from '../../components/ui/Lable';
import Input from '../../components/ui/Input';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    if (!token) return setError("Token không hợp lệ.");
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, data.password);
      setIsSuccess(true);
      // Tự động chuyển hướng sau 3s
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data || 'Link đã hết hạn hoặc không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  // Validate confirm password
  const password = watch("password");

  if (!token) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-6 text-center">
                <h2 className="text-xl font-bold text-red-600">Lỗi đường dẫn</h2>
                <p className="text-gray-500 mt-2">Đường dẫn này thiếu token xác thực.</p>
                <Link to="/forgot-password"><Button variant="outline" className="mt-4">Thử lại</Button></Link>
            </Card>
        </div>
     )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
          <p className="text-sm text-gray-500">Nhập mật khẩu mới cho tài khoản của bạn</p>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Thành công!</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                Mật khẩu của bạn đã được thay đổi. Đang chuyển hướng về trang đăng nhập...
              </p>
              <Button variant="ghost" onClick={() => navigate('/login')} className="w-full">
                Đăng nhập ngay
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    {...register("password", { 
                        required: "Mật khẩu là bắt buộc", 
                        minLength: { value: 6, message: "Tối thiểu 6 ký tự" } 
                    })}
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    {...register("confirmPassword", { 
                        required: true,
                        validate: (val) => val === password || "Mật khẩu không khớp"
                    })}
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <Button variant="ghost" type="submit" className="w-full" isLoading={loading}>
                Xác nhận thay đổi
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordPage