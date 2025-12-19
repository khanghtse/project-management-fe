import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Lable';
import { workspaceService } from '../../services/WorkspaceService';
import toast from 'react-hot-toast';

const CreateWorkspaceModal = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const newWorkspace = await workspaceService.createWorkspace(data);
      reset(); // Xóa form
      onSuccess(newWorkspace); // Callback ra ngoài để update list
      onClose();
      toast.success("Tạo workspace thành công");
    } catch (error) {
      //alert("Lỗi tạo workspace");
      toast.error("Lỗi tạo workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Không gian làm việc mới">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Tên Workspace</Label>
          <Input {...register("name", { required: true })} placeholder="VD: Team Marketing, Dev Team..." />
        </div>
        <div>
          <Label>Mô tả (Tùy chọn)</Label>
          <Input {...register("description")} placeholder="Mô tả ngắn về team này" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="ghost" isLoading={loading}>Tạo mới</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;