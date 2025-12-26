import { useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import OAuth2Redirect from './features/auth/OAuth2Redirect';
import { Toaster } from 'react-hot-toast';
import AppLayout from './layouts/AppLayout';
import ProjectListPage from './features/projects/ProjectListPage';
import KanbanBoard from './features/board/KanbanBoard';
import AcceptInvitePage from './features/workspaces/AcceptInvitePage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import ProfilePage from './features/users/ProfilePage';
import DashboardPage from './features/projects/DashboardPage';

// Component bảo vệ Route (chỉ cho user đã login vào)
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Wrapper để lấy projectId từ URL
const BoardPage = () => {
  const { projectId } = useParams();
  return <KanbanBoard projectId={projectId} />;
};

// Trang Dashboard tạm thời
// const Dashboard = () => (
//   <div className="p-8">
//     <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//     <p className="mt-4 text-gray-600">Chào mừng bạn đã đăng nhập thành công!</p>
//     <button 
//       onClick={() => {
//         localStorage.removeItem('accessToken');
//         window.location.reload();
//       }}
//       className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//     >
//       Đăng xuất
//     </button>
//   </div>
// );

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        {/* Route Xử lý Lời mời (Tự kiểm tra auth bên trong) */}
        <Route path="/accept-invite" element={<AcceptInvitePage />} />
        {/* Route Quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes (Bên trong Dashboard) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ProjectListPage />} /> {/* Mặc định */}
            <Route path="/workspaces/:workspaceId" element={<ProjectListPage />} />
            {/* Route mới: Khi click vào 1 project */}
             <Route path="/projects/:projectId/board" element={<BoardPage />} />
             <Route path="/projects/:projectId/dashboard" element={<DashboardPage />} />
             <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position='top-right'/>
    </BrowserRouter>
  )
}

export default App
