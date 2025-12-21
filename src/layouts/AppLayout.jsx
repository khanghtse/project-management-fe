import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { workspaceService } from '../services/WorkspaceService';
import { Briefcase, ChevronRight, LogOut, Plus } from 'lucide-react';
import CreateWorkspaceModal from '../features/workspaces/CreateWorkspaceModal';

const AppLayout = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load danh sách workspace khi vào app
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await workspaceService.getMyWorkspaces();
      setWorkspaces(data);
    } catch (error) {
      console.error("Failed to load workspaces", error);
    }
  };

  // Lấy ID workspace đang chọn từ URL (nếu có)
  // URL dạng: /workspaces/:id
  const activeWorkspaceId = location.pathname.split('/')[2];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-black font-bold">
            P
          </div>
          <span className="font-bold text-gray-800">PMS System</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspaces</h3>
            <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-primary-600">
              <Plus className='cursor-pointer' size={16} />
            </button>
          </div>
          
          <nav className="space-y-1 px-2">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => navigate(`/workspaces/${ws.id}`)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeWorkspaceId === ws.id 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Briefcase size={18} className="mr-3 text-gray-400" />
                <span className="flex-1 text-left truncate">{ws.name}</span>
                {activeWorkspaceId === ws.id && <ChevronRight size={16} />}
              </button>
            ))}
            
            {workspaces.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-4">
                Chưa có workspace nào.
              </div>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOut size={18} className="mr-3" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-auto">
        <Outlet /> 
      </main>

      {/* Modal tạo workspace luôn sẵn sàng ở layout */}
      <CreateWorkspaceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newWs) => {
          setWorkspaces([...workspaces, newWs]);
          navigate(`/workspaces/${newWs.id}`);
        }}
      />
    </div>
  );
};

export default AppLayout;