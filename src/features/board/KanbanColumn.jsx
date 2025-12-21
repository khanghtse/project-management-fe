import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react'
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ column, tasks, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'COLUMN', ...column } // Để biết đang thả vào cột nào
  });

  return (
    <div className="flex flex-col w-80 shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          {column.name} 
          <span className="ml-2 bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {tasks.length}
          </span>
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => onAddTask(column.id)}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Column Body (Droppable Area) */}
      <div 
        ref={setNodeRef} 
        className="flex-1 bg-gray-100/50 rounded-xl p-2 min-h-[500px]"
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Kéo thả task vào đây
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanColumn