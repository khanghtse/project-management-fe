import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { workspaceService } from '../../services/WorkspaceService';
import Modal from '../../components/ui/Modal';
import Label from '../../components/ui/Lable';
import Input from '../../components/ui/Input';
import { Calendar, Check, Flag, Trash2, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import { taskService } from '../../services/TaskService';
import TaskComments from './TaskComments';
import TaskChecklist from './TaskChecklist';
import toast from 'react-hot-toast';
import TaskAttachments from './TaskAttachments';

const TaskModal = ({ isOpen, onClose, projectId, columnId, workspaceId, taskToEdit, onSuccess }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState(new Set());
  
  // State lưu task hiện tại (được cập nhật realtime)
  const [currentTask, setCurrentTask] = useState(taskToEdit);

  useEffect(() => {
    if (isOpen) {
      if (workspaceId) {
        workspaceService.getMembers(workspaceId).then(setMembers).catch(console.error);
      }
      if (taskToEdit) {
        setValue('title', taskToEdit.title);
        setValue('description', taskToEdit.description);
        setValue('priority', taskToEdit.priority);
        const ids = new Set(taskToEdit.assignees?.map(u => u.id) || []);
        setSelectedAssignees(ids);
        setCurrentTask(taskToEdit); // Reset currentTask mỗi khi mở modal
      } else {
        reset();
        setValue('priority', 'MEDIUM');
        setSelectedAssignees(new Set());
        setCurrentTask(null);
      }
    }
  }, [isOpen, taskToEdit, workspaceId]);

  // --- HÀM LÀM MỚI DỮ LIỆU TASK ---
  const refreshCurrentTask = async () => {
    if (currentTask) {
      try {
        // Gọi API lấy task mới nhất (Cần đảm bảo API getTask đã có ở service)
        const updatedTask = await taskService.getTask(currentTask.id);
        setCurrentTask(updatedTask);
        onSuccess(); // Vẫn gọi onSuccess để cập nhật Board bên ngoài
      } catch (error) {
        console.error("Failed to refresh task", error);
      }
    }
  };

  const toggleAssignee = (userId) => {
    const newSet = new Set(selectedAssignees);
    if (newSet.has(userId)) newSet.delete(userId);
    else newSet.add(userId);
    setSelectedAssignees(newSet);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      assigneeIds: Array.from(selectedAssignees)
    };

    try {
      if (taskToEdit) {
        const updated = await taskService.updateTask(taskToEdit.id, payload);
        setCurrentTask(updated); // Cập nhật luôn UI sau khi sửa
        toast.success("Cập nhật công việc thành công");
      } else {
        await taskService.createTask(projectId, { ...payload, columnId });
        toast.success("Tạo công việc thành công");
      }
      onSuccess();
      if (!taskToEdit) onClose(); // Nếu tạo mới thì đóng, sửa thì giữ nguyên
    } catch (error) {
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Bạn chắc chắn muốn xóa task này?")) return;
    try {
      await taskService.deleteTask(taskToEdit.id);
      onSuccess();
      onClose();
      toast.success("Xóa task thành công");
    } catch (e) { alert("Lỗi xóa task"); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentTask ? currentTask.displayId : "Tạo công việc"} className="max-w-5xl">
      <form id="task-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- MAIN CONTENT --- */}
          <div className="flex-1 space-y-6">
            <div>
              <input 
                {...register("title", { required: true })} 
                className="w-full text-2xl font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder:text-gray-300"
                placeholder="Nhập tên công việc..."
              />
            </div>

            <div>
              <Label className="text-gray-500 mb-2 uppercase text-xs font-bold tracking-wide">Mô tả</Label>
              <textarea 
                {...register("description")} 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 min-h-[120px] transition-all"
                rows={4}
                placeholder="Thêm mô tả chi tiết..."
              />
            </div>

            {/* Subtasks - Truyền refreshCurrentTask vào onUpdate */}
            {currentTask && (
              <TaskChecklist 
                taskId={currentTask.id} 
                subTasks={currentTask.subTasks}
                onUpdate={refreshCurrentTask} 
              />
            )}

            {/* --- ATTACHMENTS --- */}
             {currentTask && (
                <>
                  <hr className="border-gray-100" />
                  <TaskAttachments taskId={currentTask.id} />
                </>
             )}

            {/* Comments */}
            {currentTask && <TaskComments taskId={currentTask.id} />}
          </div>

          {/* --- SIDEBAR --- */}
          <div className="w-full md:w-80 space-y-6">
            <div className="flex flex-col gap-2">
               <Label className="text-gray-500 uppercase text-xs font-bold tracking-wide">Hành động</Label>
               <Button type="submit" variant="ghost" isLoading={loading} className="w-full justify-center">
                 {taskToEdit ? 'Lưu thay đổi' : 'Tạo công việc'}
               </Button>
               {taskToEdit && (
                 <Button type="button" variant="outline" className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={handleDelete}>
                    <Trash2 size={16} className="mr-2" /> Xóa thẻ
                 </Button>
               )}
            </div>

            <hr className="border-gray-100" />

            <div>
              <Label className="text-gray-500 uppercase text-xs font-bold tracking-wide mb-2 block">Mức độ ưu tiên</Label>
              <div className="relative">
                <Flag className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <select
                  {...register("priority")}
                  className="w-full h-9 pl-9 pr-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  <option value="LOW">Low (Thấp)</option>
                  <option value="MEDIUM">Medium (Vừa)</option>
                  <option value="HIGH">High (Cao)</option>
                  <option value="URGENT">Urgent (Khẩn cấp)</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-gray-500 uppercase text-xs font-bold tracking-wide mb-2 block">
                Người thực hiện <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full ml-1">{selectedAssignees.size}</span>
              </Label>
              <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                  {members.map(member => (
                    <div 
                      key={member.id} 
                      onClick={() => toggleAssignee(member.id)}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedAssignees.has(member.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center bg-white ${selectedAssignees.has(member.id) ? 'border-primary-600' : 'border-gray-300'}`}>
                         {selectedAssignees.has(member.id) && <div className="w-2.5 h-2.5 bg-primary-600 rounded-[1px]" />}
                      </div>
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden">
                          {member.avatarUrl ? <img src={member.avatarUrl} className="w-full h-full object-cover"/> : member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{member.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {currentTask && (
                <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-gray-100">
                    <p className="flex items-center gap-2"><Calendar size={12}/> Tạo lúc: {new Date(currentTask.createdAt).toLocaleString('vi-VN')}</p>
                    <p className="flex items-center gap-2"><User size={12}/> ID: {currentTask.displayId}</p>
                </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default TaskModal