import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { projectService } from '../../services/ProjectService';
import Modal from '../../components/ui/Modal';
import Label from '../../components/ui/Lable';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose, workspaceId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);


  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await projectService.createProject(workspaceId, data);
      reset();
      onSuccess();
      onClose();
      toast.success("Tạo dự án thành công");
    } catch (error) {
      //alert(error.response?.data?.message || "Lỗi tạo dự án");
      toast.error(error.response?.data?.message || "Lỗi tạo dự án");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Dự án mới">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Tên Dự án</Label>
          <Input {...register("name", { required: true })} placeholder="VD: Website Bán Hàng" />
        </div>
        <div>
          <Label>Mã Dự án (Key)</Label>
          <Input {...register("key", { required: true, maxLength: 5 })} placeholder="VD: WEB (Tối đa 5 ký tự)" className="uppercase" />
          <p className="text-xs text-gray-500 mt-1">Dùng làm tiền tố cho Task ID (VD: WEB-101)</p>
        </div>
        <div>
          <Label>Mô tả</Label>
          <Input {...register("description")} placeholder="Mô tả chi tiết dự án..." />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="ghost" isLoading={loading}>Tạo Dự án</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;