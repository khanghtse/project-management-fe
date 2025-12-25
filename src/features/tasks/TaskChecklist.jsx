import React, { useEffect, useState } from 'react'
import { taskService } from '../../services/TaskService';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';

const TaskChecklist = ({ taskId, subTasks = [], onUpdate }) => {
  const [newSubTask, setNewSubTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // State local để update UI ngay lập tức (Optimistic UI)
  const [localSubTasks, setLocalSubTasks] = useState(subTasks);

  // Đồng bộ lại khi props thay đổi (ví dụ khi API load xong)
  useEffect(() => {
    setLocalSubTasks(subTasks);
  }, [subTasks]);

  // Tính toán % hoàn thành dựa trên state local
  const completedCount = localSubTasks.filter(t => t.isDone).length;
  const progress = localSubTasks.length > 0 ? Math.round((completedCount / localSubTasks.length) * 100) : 0;

  const handleAdd = async () => {
    if (!newSubTask.trim()) return;
    setLoading(true);
    try {
      await taskService.createSubTask(taskId, newSubTask);
      setNewSubTask('');
      setIsAdding(false);
      onUpdate(); // Reload data từ parent
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleToggle = async (subTaskId) => {
    // 1. Cập nhật UI ngay lập tức (Optimistic Update)
    const updatedSubTasks = localSubTasks.map(t => 
      t.id === subTaskId ? { ...t, isDone: !t.isDone } : t
    );
    setLocalSubTasks(updatedSubTasks);

    // 2. Gọi API ngầm
    try {
      await taskService.toggleSubTask(subTaskId);
      // Không cần gọi onUpdate() ở đây nếu không cần thiết, 
      // vì UI đã update rồi. Nếu muốn chắc chắn đồng bộ server thì gọi.
      onUpdate(); 
    } catch (e) { 
      console.error(e); 
      // Nếu lỗi thì rollback lại state cũ (Optional)
      setLocalSubTasks(subTasks);
    }
  };

  const handleDelete = async (subTaskId) => {
    if(!window.confirm("Xóa mục này?")) return;
    try {
      // Cập nhật UI ngay lập tức để cảm giác nhanh hơn
      setLocalSubTasks(prev => prev.filter(t => t.id !== subTaskId));
      
      await taskService.deleteSubTask(subTaskId);
      onUpdate();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <CheckSquare size={16} /> Việc cần làm
        </h3>
        {localSubTasks.length > 0 && (
           <span className="text-xs text-gray-500">{progress}%</span>
        )}
      </div>

      {/* Progress Bar */}
      {localSubTasks.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden"> {/* Thêm overflow-hidden */}
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-in-out" // Thêm duration và ease
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* List */}
      <div className="space-y-2 mb-3">
        {localSubTasks.map(st => (
          <div key={st.id} className="flex items-center group">
            <input 
              type="checkbox" 
              checked={st.isDone || false} // Đảm bảo không bị undefined
              onChange={() => handleToggle(st.id)}
              className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer accent-primary-600"
            />
            <span 
                onClick={() => handleToggle(st.id)}
                className={`ml-3 text-sm flex-1 cursor-pointer select-none transition-all duration-200 ${st.isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}
            >
              {st.title}
            </span>
            <button 
              onClick={() => handleDelete(st.id)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {isAdding ? (
        <div className="mt-2 animate-in fade-in zoom-in duration-200">
          <input
            autoFocus
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
            placeholder="Nhập tên việc cần làm..."
            value={newSubTask}
            onChange={e => setNewSubTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleAdd} disabled={loading}>Thêm</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Hủy</Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 justify-start"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={14} className="mr-2"/> Thêm mục
        </Button>
      )}
    </div>
  );
}

export default TaskChecklist