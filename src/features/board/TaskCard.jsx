import React from 'react'
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';
import { Clock, Flag, User } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

// Định nghĩa màu sắc cho từng mức độ
const PRIORITY_COLORS = {
  LOW: { bg: 'bg-slate-100', text: 'text-slate-600', icon: 'text-slate-400' },
  MEDIUM: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-400' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-400' },
  URGENT: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-400' }
};

const TaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { ...task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Lấy config màu, mặc định là MEDIUM nếu không khớp
  const priorityConfig = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM;

  // Lấy tối đa 3 người đầu tiên để hiển thị, còn lại hiện số +
  const assigneesToShow = task.assignees?.slice(0, 3) || [];
  const remainingCount = (task.assignees?.length || 0) - 3;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3" onClick={onClick}>
      <Card className="cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary-200 transition-all duration-200 group bg-white border-l-4" 
            // Border trái đổi màu theo priority để dễ nhìn
            style={{ borderLeftColor: task.priority === 'URGENT' ? '#ef4444' : task.priority === 'HIGH' ? '#f97316' : 'transparent' }}
      >
        <CardContent className="p-3">
          {/* Header: ID + Priority Tag */}
          <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-gray-400 hover:text-primary-600 cursor-pointer">
               {task.displayId}
             </span>
             
             {/* Priority Badge */}
             <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${priorityConfig.bg} ${priorityConfig.text}`}>
                <Flag size={10} className={priorityConfig.icon} fill="currentColor" fillOpacity={0.2} />
                {task.priority}
             </div>
          </div>

          {/* Title */}
          <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-snug group-hover:text-primary-700">
            {task.title}
          </h4>
          
          {/* Footer: Date + Assignees Stack */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
            <div className="flex items-center text-[10px] text-gray-400 gap-1">
               <Clock size={12} />
               {/* Format ngày tháng */}
               <span>{new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            
            {/* Assignee Avatar Stack */}
            <div className="flex -space-x-2 overflow-hidden">
              {assigneesToShow.map((user) => (
                <div key={user.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600" title={user.name}>
                   {user.avatarUrl ? <img src={user.avatarUrl} className="h-full w-full object-cover rounded-full" /> : user.name.charAt(0)}
                </div>
              ))}
              
              {remainingCount > 0 && (
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600">
                  +{remainingCount}
                </div>
              )}

              {(!task.assignees || task.assignees.length === 0) && (
                 <User size={14} className="text-gray-300" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskCard