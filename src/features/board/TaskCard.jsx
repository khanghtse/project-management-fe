import React from 'react'
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';
import { User } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3" onClick={onClick}>
      <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group bg-white">
        <CardContent className="p-3">
          {/* Tags / Priority */}
          <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
               {task.displayId}
             </span>
             {task.priority === 'HIGH' && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">High</span>
             )}
          </div>

          <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{task.title}</h4>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-xs text-gray-400">
               {/* Có thể thêm ngày due date ở đây */}
            </div>
            
            {/* Assignee Avatar */}
            <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold ring-2 ring-white">
              {task.assignee ? (
                task.assignee.avatarUrl ? <img src={task.assignee.avatarUrl} className="h-6 w-6 rounded-full"/> : task.assignee.name.charAt(0)
              ) : (
                <User size={12} className="text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskCard