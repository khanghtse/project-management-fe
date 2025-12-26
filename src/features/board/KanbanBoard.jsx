import { closestCorners, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { useEffect, useMemo, useState } from 'react'
import { taskService } from '../../services/TaskService';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from '../tasks/TaskCard';
import TaskModal from '../tasks/TaskModal';
import BoardToolbar from './BoardToolbar';
import useDebounce from '../../hooks/useDebounce';


const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState([]);
  const [activeTask, setActiveTask] = useState(null); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null); 
  const [editingTask, setEditingTask] = useState(null);

  // --- STATE CHO FILTER ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMyTasks, setFilterMyTasks] = useState(false);
  const [filterPriority, setFilterPriority] = useState(null);

  // Debounce search term để không gọi API liên tục khi gõ
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Gọi API mỗi khi filter thay đổi
  useEffect(() => {
    if (projectId) {
        fetchBoard();
    }
  }, [projectId, debouncedSearchTerm, filterMyTasks, filterPriority]);

  const fetchBoard = async () => {
    try {
      // Truyền params vào API
      const params = {
          keyword: debouncedSearchTerm || undefined,
          priority: filterPriority || undefined,
          isMyTask: filterMyTasks || undefined
      };
      
      const data = await taskService.getBoard(projectId, params);
      setColumns(data.columns);
      setWorkspaceId(data.workspaceId);
    } catch (error) {
      console.error("Failed to load board", error);
    }
  };

  // ... (Phần logic drag and drop giữ nguyên) ...
  // Lưu ý: Vẫn giữ check chặn drag khi đang filter
  const isFiltering = !!(debouncedSearchTerm || filterMyTasks || filterPriority);

  const handleDragStart = (event) => {
    if (isFiltering) return; // Chặn
    const { active } = event;
    const task = findTaskById(active.id);
    setActiveTask(task);
  };
  
  const handleDragEnd = async (event) => {
    if (isFiltering) return; // Chặn

    // ... (Code handleDragEnd cũ giữ nguyên toàn bộ)
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnByTaskId(activeId);
    const overColumn = findColumnByTaskId(overId) || findColumnById(overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn !== overColumn || activeId !== overId) {
      const oldColumns = JSON.parse(JSON.stringify(columns));
      const newColumns = [...columns];
      const activeColIndex = newColumns.findIndex(c => c.id === activeColumn.id);
      const overColIndex = newColumns.findIndex(c => c.id === overColumn.id);
      
      const activeTasks = newColumns[activeColIndex].tasks;
      const overTasks = newColumns[overColIndex].tasks;

      const activeTaskIndex = activeTasks.findIndex(t => t.id === activeId);
      let overTaskIndex;

      if (over.data.current?.type === 'COLUMN') {
        overTaskIndex = overTasks.length; 
      } else {
        overTaskIndex = overTasks.findIndex(t => t.id === overId);
      }

      let newOverTasks;
      if (activeColumn.id === overColumn.id) {
        newOverTasks = arrayMove(overTasks, activeTaskIndex, overTaskIndex);
        newColumns[overColIndex].tasks = newOverTasks;
      } else {
        const [movedTask] = activeTasks.splice(activeTaskIndex, 1);
        movedTask.columnId = overColumn.id; 
        overTasks.splice(overTaskIndex, 0, movedTask);
        newOverTasks = overTasks;
      }

      setColumns(newColumns);

      const newIndex = newOverTasks.findIndex(t => t.id === activeId);
      const prevTask = newOverTasks[newIndex - 1];
      const nextTask = newOverTasks[newIndex + 1];
      const prevRank = prevTask ? prevTask.position : null;
      const nextRank = nextTask ? nextTask.position : null;

      try {
        await taskService.moveTask(activeId, {
          targetColumnId: overColumn.id,
          prevTaskRank: prevRank,
          nextTaskRank: nextRank
        });
      } catch (error) {
        console.error("Move failed", error);
        setColumns(oldColumns); 
      }
    }
  };

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
    setEditingTask(null);
    setIsCreateModalOpen(true);
  };

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <BoardToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterMyTasks={filterMyTasks}
        onToggleMyTasks={() => setFilterMyTasks(!filterMyTasks)}
        filterPriority={filterPriority}
        onFilterPriority={(p) => setFilterPriority(prev => prev === p ? null : p)}
      />
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-100/50 p-6">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-6 items-start">
            {/* Render columns như bình thường */}
            {columns.map(col => (
              <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={col.tasks} 
                onAddTask={handleOpenCreateModal}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTask(null);
        }}
        columnId={selectedColumnId}
        projectId={projectId}
        workspaceId={workspaceId}
        taskToEdit={editingTask}
        onSuccess={fetchBoard}
      />
    </div>
  );
}

export default KanbanBoard