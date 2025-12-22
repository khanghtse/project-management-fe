import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Label from '../../components/ui/Lable';
import { Mail } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { workspaceService } from '../../services/WorkspaceService';
import toast from 'react-hot-toast';

const InviteMemberModal = ({ isOpen, onClose, workspaceId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await workspaceService.inviteMember(workspaceId, data.email);
      //alert(`Đã gửi lời mời tới ${data.email}`);
      reset();
      onClose();
      toast.success("Gửi lời mời thành công");
    } catch (error) {
      //alert(error.response?.data?.message || "Lỗi gửi lời mời");
      toast.error(error.response?.data?.message || "Lỗi gửi lời mời");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mời thành viên vào Workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Email người nhận</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })} 
              type="email"
              placeholder="dongnghiep@company.com" 
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Người được mời sẽ nhận email chứa liên kết để tham gia.
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="ghost" isLoading={loading}>Gửi lời mời</Button>
        </div>
      </form>
    </Modal>
  );
}

export default InviteMemberModal