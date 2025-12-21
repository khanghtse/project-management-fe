import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectService } from "../../services/ProjectService";
import { Clock, FolderKanban, Plus, UserPlus } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import CardContent from "../../components/ui/CardContent";
import CreateProjectModal from "./CreateProjectModal";
import InviteMemberModal from "../workspaces/InviteMemberModal";

const ProjectListPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý các modal
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

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
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Không gian làm việc</h1>
          <p className="text-gray-500">Quản lý dự án và thành viên</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsInviteMemberModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus size={16} />
            Mời thành viên
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> 
            Tạo Dự án mới
          </Button>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group border border-gray-200"
              onClick={() => navigate(`/projects/${project.id}/board`)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FolderKanban size={24} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 border border-gray-200">
                    {project.key}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{project.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                  {project.description || "Chưa có mô tả cho dự án này."}
                </p>

                <div className="flex items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                  <Clock size={12} className="mr-1" />
                  Cập nhật: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('vi-VN') : 'Mới tạo'}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <FolderKanban size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium mb-1">Chưa có dự án nào</p>
              <p className="text-gray-500 text-sm mb-4">Hãy tạo dự án đầu tiên để bắt đầu công việc</p>
              <Button variant="outline" onClick={() => setIsCreateProjectModalOpen(true)}>
                Tạo dự án ngay
              </Button>
            </div>
          )}
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* Modal Tạo Dự Án */}
      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        workspaceId={workspaceId}
        onSuccess={fetchProjects}
      />

      {/* Modal Mời Thành Viên */}
      <InviteMemberModal
        isOpen={isInviteMemberModalOpen}
        onClose={() => setIsInviteMemberModalOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default ProjectListPage;
