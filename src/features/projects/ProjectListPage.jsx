import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { projectService } from '../../services/ProjectService';
import { Clock, FolderKanban, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';
import CreateProjectModal from './CreateProjectModal';

const ProjectListPage = () => {
  const { workspaceId } = useParams(); // Lấy ID từ URL
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchProjects();
    }
  }, [workspaceId]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(workspaceId);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <FolderKanban size={64} className="mb-4 text-gray-300" />
        <p className="text-lg">Chọn một Workspace để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách Dự án</h1>
          <p className="text-gray-500">Quản lý và theo dõi các dự án trong workspace này</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4 text-black" /> <p className='text-black'>Tạo dự án mới</p>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FolderKanban size={24} />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {project.key}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                  {project.description || "Chưa có mô tả"}
                </p>

                <div className="flex items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                  <Clock size={12} className="mr-1" />
                  Cập nhật: {new Date(project.updatedAt).toLocaleDateString('vi-VN')}
                </div>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">Chưa có dự án nào trong workspace này</p>
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>Tạo ngay</Button>
            </div>
          )}
        </div>
      )}

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workspaceId={workspaceId}
        onSuccess={fetchProjects} // Load lại list sau khi tạo xong
      />
    </div>
  );
};

export default ProjectListPage;