import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { workspaceService } from '../../services/WorkspaceService';
import Modal from '../../components/ui/Modal';
import Label from '../../components/ui/Lable';
import Input from '../../components/ui/Input';
import { Check, Flag, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { taskService } from '../../services/TaskService';

const TaskModal = ({ isOpen, onClose, projectId, columnId, workspaceId, taskToEdit, onSuccess }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]); // List thành viên workspace
  
  // State quản lý danh sách assignee đã chọn (Set of IDs)
  const [selectedAssignees, setSelectedAssignees] = useState(new Set());

  // Load data khi mở modal
  useEffect(() => {
    if (isOpen) {
      // 1. Load members
      if (workspaceId) {
        workspaceService.getMembers(workspaceId).then(setMembers).catch(console.error);
      }

      // 2. Setup form data
      if (taskToEdit) {
        setValue('title', taskToEdit.title);
        setValue('description', taskToEdit.description);
        setValue('priority', taskToEdit.priority);
        // Set assignees từ task cũ
        const ids = new Set(taskToEdit.assignees?.map(u => u.id) || []);
        setSelectedAssignees(ids);
      } else {
        reset();
        setValue('priority', 'MEDIUM');
        setSelectedAssignees(new Set());
      }
    }
  }, [isOpen, taskToEdit, workspaceId]);

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
        // UPDATE MODE
        await taskService.updateTask(taskToEdit.id, payload);
      } else {
        // CREATE MODE
        await taskService.createTask(projectId, { ...payload, columnId });
      }
      onSuccess(); // Refresh board
      onClose();
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
    } catch (e) { alert("Lỗi xóa task"); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? `Cập nhật ${taskToEdit.displayId}` : "Thêm công việc mới"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Title */}
        <div>
          <Label>Tiêu đề <span className="text-red-500">*</span></Label>
          <Input {...register("title", { required: true })} placeholder="Tên công việc" autoFocus />
        </div>

        {/* Priority */}
        <div>
          <Label>Mức độ ưu tiên</Label>
          <div className="relative">
            <Flag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              {...register("priority")}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Assignees (Multi-select Custom UI) */}
        <div>
          <Label>Người thực hiện ({selectedAssignees.size})</Label>
          <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
            {members.length === 0 && <p className="text-xs text-gray-400">Chưa có thành viên nào.</p>}
            {members.map(member => (
              <div 
                key={member.id} 
                onClick={() => toggleAssignee(member.id)}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${selectedAssignees.has(member.id) ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100'}`}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedAssignees.has(member.id) ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}>
                   {selectedAssignees.has(member.id) && <Check size={10} className="text-white" />}
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                    {member.avatarUrl ? <img src={member.avatarUrl} className="rounded-full"/> : member.name.charAt(0)}
                </div>
                <span>{member.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{member.email}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label>Mô tả</Label>
          <textarea 
            {...register("description")} 
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-primary-500 min-h-[100px]"
            rows={3}
            placeholder="Chi tiết công việc..."
          />
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          {taskToEdit ? (
             <Button type="button" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleDelete}>
                <Trash2 size={16} className="mr-2" /> Xóa Task
             </Button>
          ) : <div></div>}
          
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
            <Button type="submit" variant="ghost" isLoading={loading}>
              {taskToEdit ? 'Lưu thay đổi' : 'Thêm thẻ'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default TaskModal