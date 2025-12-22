import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { invitationService } from '../../services/InvitationService';
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';
import { CheckCircle2, Loader2, LogIn, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('PROCESSING'); // PROCESSING | SUCCESS | ERROR
  const [message, setMessage] = useState('Đang xác thực lời mời...');

  // Dùng ref để chặn việc gọi API 2 lần (do React StrictMode)
  const hasCalledApi = useRef(false);

  // Kiểm tra token có trong localStorage không
  const accessToken = localStorage.getItem('accessToken');
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    // 1. Validate cơ bản
    if (!token) {
      setStatus('ERROR');
      setMessage('Đường dẫn không hợp lệ (Thiếu token).');
      return;
    }

    // 2. Nếu chưa login -> Bỏ qua, để phần render xử lý Redirect
    if (!isAuthenticated) {
        return; 
    }

    // 3. Chặn gọi 2 lần
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    // 4. Gọi API
    const accept = async () => {
        try {
            await invitationService.acceptInvitation(token);
            setStatus('SUCCESS');
            setMessage('Bạn đã tham gia Workspace thành công!');
            // Tự động chuyển hướng sau 2s
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error(error);
            setStatus('ERROR');
            const errorMsg = error.response?.data?.message || 
                             (typeof error.response?.data === 'string' ? error.response?.data : 'Lỗi không xác định hoặc lời mời đã được sử dụng.');
            setMessage(errorMsg);
        }
    };
    accept();

  }, [token, isAuthenticated, navigate]);

  // --- RENDER LOGIC ---

  // Case 0: Token rỗng -> Hiển thị lỗi ngay, không cần bắt login
  if (!token) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg text-center p-6 border-0">
                <CardContent className="flex flex-col items-center gap-4 pt-6">
                    <XCircle className="h-16 w-16 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Lỗi đường dẫn</h2>
                    <p className="text-red-600">Đường dẫn không hợp lệ hoặc thiếu token.</p>
                    <Button onClick={() => navigate('/')} className="mt-4">Về Trang chủ</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  // Case 1: Chưa login -> Chuyển hướng sang Login kèm returnUrl
  if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(`/accept-invite?token=${token}`);
      return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // Case 2: Đã login -> Hiển thị trạng thái xử lý
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg text-center p-6 border-0">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          
          {status === 'PROCESSING' && (
            <>
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900">Đang xử lý...</h2>
              <p className="text-gray-500 text-sm">Đang thêm bạn vào Workspace.</p>
            </>
          )}

          {status === 'SUCCESS' && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Thành công!</h2>
              <p className="text-gray-600">{message}</p>
              <Button onClick={() => navigate('/')} className="mt-4 w-full">
                Về Dashboard ngay
              </Button>
            </>
          )}

          {status === 'ERROR' && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Không thể tham gia</h2>
              <div className="bg-red-50 p-3 rounded-md w-full text-left border border-red-100">
                  <p className="text-red-700 text-sm font-medium text-center">{message}</p>
              </div>
              
              <div className="flex flex-col gap-3 w-full mt-4">
                <Button 
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white"
                    onClick={() => {
                        localStorage.removeItem('accessToken');
                        window.location.reload(); 
                    }}
                >
                    <LogIn size={16}/> Đăng xuất & Đổi tài khoản khác
                </Button>
                
                <Button variant="ghost" onClick={() => navigate('/')} className="w-full text-gray-500">
                  Bỏ qua, về trang chủ
                </Button>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

export default AcceptInvitePage