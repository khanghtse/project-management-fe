import React, { useEffect, useRef, useState } from 'react'
import { attachmentService } from '../../services/AttachmentService';
import { ExternalLink, FileIcon, Loader2, Paperclip, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';

const TaskAttachments = ({ taskId }) => {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  const loadAttachments = async () => {
    try {
      const data = await attachmentService.getAttachments(taskId);
      setAttachments(data);
    } catch (e) { console.error(e); }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const newFile = await attachmentService.uploadAttachment(taskId, file);
      setAttachments([newFile, ...attachments]);
    } catch (error) {
      alert("Lỗi upload file (Tối đa 10MB)");
    } finally {
      setUploading(false);
      // Reset input để chọn lại file cũ được
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa file này?")) return;
    try {
      await attachmentService.deleteAttachment(id);
      setAttachments(attachments.filter(a => a.id !== id));
    } catch (e) { alert("Lỗi xóa file"); }
  };

  // Helper check xem file có phải ảnh không
  const isImage = (fileType) => fileType.startsWith('image/');

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <Paperclip size={16} /> Đính kèm ({attachments.length})
        </h3>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
          />
          <Button 
            size="sm" 
            variant="secondary" 
            disabled={uploading}
            onClick={() => fileInputRef.current.click()}
          >
            {uploading ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : null}
            {uploading ? "Đang tải..." : "Thêm tệp"}
          </Button>
        </div>
      </div>

      {/* List Files */}
      <div className="grid grid-cols-2 gap-3">
        {attachments.map(file => (
          <div key={file.id} className="group relative border border-gray-200 rounded-lg p-2 flex gap-3 hover:bg-gray-50 transition-colors">
            {/* Preview Thumbnail */}
            <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
              {isImage(file.fileType) ? (
                <img src={file.fileUrl} alt={file.fileName} className="h-full w-full object-cover" />
              ) : (
                <FileIcon className="text-gray-400 h-8 w-8" />
              )}
            </div>
            
            {/* Meta Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-700 truncate" title={file.fileName}>
                {file.fileName}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(file.uploadedAt).toLocaleDateString('vi-VN')}
              </p>
              <a 
                href={file.fileUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-primary-600 hover:underline flex items-center gap-1 mt-1"
              >
                <ExternalLink size={10} /> Mở file
              </a>
            </div>

            {/* Delete Button */}
            <button 
              onClick={() => handleDelete(file.id)}
              className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskAttachments