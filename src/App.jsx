import { useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuth2Redirect from './pages/OAuth2Redirect';
import { Toaster } from 'react-hot-toast';

// Component bảo vệ Route (chỉ cho user đã login vào)
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Trang Dashboard tạm thời
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
    <p className="mt-4 text-gray-600">Chào mừng bạn đã đăng nhập thành công!</p>
    <button 
      onClick={() => {
        localStorage.removeItem('accessToken');
        window.location.reload();
      }}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Đăng xuất
    </button>
  </div>
);

function App() {

  return (
    <>
    
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          {/* Sau này thêm: <Route path="/projects" element={<ProjectList />} /> */}
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
    </>
    
  )
}

export default App
