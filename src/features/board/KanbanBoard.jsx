import { closestCorners, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react'
import { taskService } from '../../services/TaskService';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState([]);
  const [activeTask, setActiveTask] = useState(null); // Task đang được kéo
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  // Cấu hình Sensor để kéo thả mượt hơn (bỏ qua click nhỏ)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    fetchBoard();
  }, [projectId]);

  const fetchBoard = async () => {
    try {
      const data = await taskService.getBoard(projectId);
      // Backend trả về: { projectId, columns: [ {..., tasks: []} ] }
      setColumns(data.columns);
    } catch (error) {
      console.error("Failed to load board", error);
    }
  };

  // --- LOGIC KÉO THẢ ---
  const handleDragStart = (event) => {
    const { active } = event;
    // Tìm task object từ ID để hiện Overlay
    const task = findTaskById(active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Tìm xem task đang ở cột nào
    const activeColumn = findColumnByTaskId(activeId);
    const overColumn = findColumnByTaskId(overId) || findColumnById(overId); // Over có thể là task hoặc chính cột đó

    if (!activeColumn || !overColumn) return;

    // 1. Nếu khác cột hoặc khác vị trí trong cùng cột
    if (activeColumn !== overColumn || activeId !== overId) {
      
      // Clone state cũ để làm Optimistic UI (Cập nhật giao diện ngay lập tức)
      const oldColumns = JSON.parse(JSON.stringify(columns));

      // Tính toán vị trí mới trong state local
      const newColumns = [...columns];
      const activeColIndex = newColumns.findIndex(c => c.id === activeColumn.id);
      const overColIndex = newColumns.findIndex(c => c.id === overColumn.id);
      
      const activeTasks = newColumns[activeColIndex].tasks;
      const overTasks = newColumns[overColIndex].tasks;

      const activeTaskIndex = activeTasks.findIndex(t => t.id === activeId);
      let overTaskIndex;

      if (over.data.current?.type === 'COLUMN') {
        // Nếu thả vào vùng trống của cột -> Xuống cuối
        overTaskIndex = overTasks.length; 
      } else {
        // Nếu thả lên một task khác
        overTaskIndex = overTasks.findIndex(t => t.id === overId);
        // Logic check xem thả trên hay dưới task đó (dựa vào chiều di chuyển mouse - optional, dnd-kit auto handle sortable)
        // Ở đây với arrayMove của sortable, nó tự hiểu index.
      }

      let newOverTasks;
      if (activeColumn.id === overColumn.id) {
        // Cùng cột: chỉ đổi chỗ
        newOverTasks = arrayMove(overTasks, activeTaskIndex, overTaskIndex);
        newColumns[overColIndex].tasks = newOverTasks;
      } else {
        // Khác cột: Xóa bên cũ, thêm bên mới
        const [movedTask] = activeTasks.splice(activeTaskIndex, 1);
        movedTask.columnId = overColumn.id; // Update ID cột trong local
        overTasks.splice(overTaskIndex, 0, movedTask); // Chèn vào vị trí mới
        newOverTasks = overTasks;
      }

      // Cập nhật State React ngay lập tức (Optimistic)
      setColumns(newColumns);

      // --- TÍNH TOÁN LEXORANK ĐỂ GỌI API ---
      // Lấy task đứng trước và sau vị trí mới
      // Lưu ý: newOverTasks lúc này ĐÃ CHỨA task vừa thả vào tại vị trí overTaskIndex (hoặc index mới sau arrayMove)
      
      // Xác định lại index thực tế của task vừa thả trong mảng mới
      const newIndex = newOverTasks.findIndex(t => t.id === activeId);
      
      const prevTask = newOverTasks[newIndex - 1];
      const nextTask = newOverTasks[newIndex + 1];

      const prevRank = prevTask ? prevTask.position : null;
      const nextRank = nextTask ? nextTask.position : null;

      // Gọi API Backend
      try {
        await taskService.moveTask(activeId, {
          targetColumnId: overColumn.id,
          prevTaskRank: prevRank,
          nextTaskRank: nextRank
        });
      } catch (error) {
        console.error("Move failed, reverting...", error);
        setColumns(oldColumns); // Rollback nếu lỗi
        alert("Có lỗi khi di chuyển task!");
      }
    }
  };

  // --- HELPER FUNCTIONS ---
  const findColumnByTaskId = (taskId) => {
    return columns.find(col => col.tasks.some(t => t.id === taskId));
  };
  const findColumnById = (colId) => {
    return columns.find(col => col.id === colId);
  };
  const findTaskById = (taskId) => {
    for (const col of columns) {
      const task = col.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  const handleOpenCreateModal = (columnId) => {
    setSelectedColumnId(columnId);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white flex justify-between items-center">
         <h2 className="text-xl font-bold">Kanban Board</h2>
         {/* Filter, Members... */}
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full p-6 gap-6">
            {columns.map(col => (
              <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={col.tasks} 
                onAddTask={handleOpenCreateModal}
              />
            ))}
          </div>

          {/* Overlay khi đang kéo (Hiệu ứng mờ) */}
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        columnId={selectedColumnId}
        projectId={projectId}
        onSuccess={fetchBoard}
      />
    </div>
  );
}

export default KanbanBoard