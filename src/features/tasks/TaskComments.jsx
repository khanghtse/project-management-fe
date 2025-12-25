import React, { useEffect, useRef, useState } from 'react'
import { commentService } from '../../services/CommentService';
import Button from '../../components/ui/Button';
import { Send } from 'lucide-react';

const TaskComments = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dùng để auto scroll xuống cuối khi có comment mới
  const messagesEndRef = useRef(null);

  const fetchComments = async () => {
    try {
      const data = await commentService.getComments(taskId);
      setComments(data);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load comments", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async (e) => {
    // Nếu được gọi từ sự kiện (ví dụ click button hoặc keydown), ngăn chặn hành vi mặc định
    if (e && e.preventDefault) e.preventDefault();
    
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const comment = await commentService.addComment(taskId, newComment);
      setComments([...comments, comment]);
      setNewComment('');
      scrollToBottom();
    } catch (error) {
      alert("Gửi bình luận thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nhấn Enter trong ô input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn submit form cha (TaskModal)
      handleSend();
    }
  };

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <h3 className="font-semibold text-sm text-gray-700 mb-3">Bình luận</h3>
      
      {/* List Comments */}
      <div className="space-y-4 max-h-[200px] overflow-y-auto mb-4 pr-1 custom-scrollbar">
        {comments.length === 0 && <p className="text-xs text-gray-400 italic">Chưa có bình luận nào.</p>}
        
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 overflow-hidden">
               {comment.author.avatarUrl ? <img src={comment.author.avatarUrl} className="w-full h-full object-cover" alt="avatar"/> : comment.author.name.charAt(0)}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">{comment.author.name}</span>
                <span className="text-[10px] text-gray-400">
                  {new Date(comment.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-br-xl rounded-bl-xl rounded-tr-xl text-sm text-gray-700 border border-gray-100">
                {comment.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Thay đổi từ <form> sang <div> để tránh lỗi lồng form */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown} // Bắt sự kiện Enter tại đây
            disabled={loading}
          />
        </div>
        <Button 
            type="button" // Quan trọng: type="button" để không submit form cha
            onClick={handleSend}
            variant="ghost"
            size="sm" 
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            disabled={loading || !newComment.trim()}
        >
            <Send size={16} />
        </Button>
      </div>
    </div>
  );
}

export default TaskComments