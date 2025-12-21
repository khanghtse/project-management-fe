import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { taskService } from '../../services/TaskService';
import Modal from '../../components/ui/Modal';
import Label from '../../components/ui/Lable';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ isOpen, onClose, projectId, columnId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Gọi API tạo task
      await taskService.createTask(projectId, {
        ...data,
        columnId: columnId,
        priority: 'MEDIUM' // Tạm thời hardcode, sau này thêm select
      });
      
      reset();
      onSuccess(); // Refresh lại board
      onClose();
      toast.success("Tạo task thành công");
    } catch (error) {
      //alert(error.response?.data?.message || "Lỗi tạo task");
      toast.error(error.response?.data?.message || "Lỗi tạo task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm công việc mới">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Tiêu đề công việc</Label>
          <Input 
            {...register("title", { required: true })} 
            placeholder="Cần làm gì?" 
            autoFocus
          />
        </div>
        <div>
          <Label>Mô tả chi tiết</Label>
          <textarea 
            {...register("description")} 
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            rows={3}
            placeholder="Mô tả thêm..."
          />
        </div>
        
        {/* Sau này thêm Select Priority và Assignee ở đây */}

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="ghost" isLoading={loading}>Thêm thẻ</Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTaskModal