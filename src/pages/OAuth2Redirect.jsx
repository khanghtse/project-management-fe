import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


const OAuth2Redirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span className="ml-2 text-gray-600">Đang xử lý đăng nhập...</span>
    </div>
  );
};

export default OAuth2Redirect;