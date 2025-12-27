import React, { useEffect, useState } from 'react'
import { taskService } from '../../services/TaskService';
import { History } from 'lucide-react';

const TaskActivities = ({ taskId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Gọi API lấy lịch sử mỗi khi mở task
    const loadActivities = async () => {
      setLoading(true);
      try {
        const data = await taskService.getActivities(taskId);
        setActivities(data);
      } catch (error) {
        console.error("Failed to load activities", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [taskId]);

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h3 className="font-semibold text-sm text-gray-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
        <History size={16}/> Lịch sử hoạt động
      </h3>
      
      {loading ? (
          <p className="text-xs text-gray-400 pl-2">Đang tải lịch sử...</p>
      ) : (
        <div className="space-y-6 pl-2">
            {activities.length === 0 && <p className="text-xs text-gray-400 italic">Chưa có hoạt động nào được ghi lại.</p>}
            
            {activities.map((log) => (
            <div key={log.id} className="flex gap-3 relative">
                {/* Đường kẻ dọc nối các điểm */}
                {activities.length > 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-gray-200 last:hidden"></div>
                )}

                {/* Avatar nhỏ */}
                <div className="mt-0.5 z-10">
                    <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden shadow-sm">
                        {log.userAvatar ? <img src={log.userAvatar} className="w-full h-full object-cover" alt="avatar"/> : log.userName.charAt(0)}
                    </div>
                </div>
                
                {/* Nội dung log */}
                <div className="flex-1">
                    <p className="text-xs text-gray-700 leading-snug">
                        <span className="font-bold text-gray-900 mr-1">{log.userName}</span> 
                        {log.content}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(log.createdAt).toLocaleString('vi-VN', {
                            hour: '2-digit', 
                            minute:'2-digit', 
                            day: '2-digit', 
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default TaskActivities