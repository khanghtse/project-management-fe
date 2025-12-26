import { Search, User, X, Filter } from 'lucide-react';
import React from 'react'
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const BoardToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  filterMyTasks, 
  onToggleMyTasks,
  filterPriority,
  onFilterPriority,
  members = [] // Danh sách thành viên để hiển thị avatar bộ lọc (optional, làm sau)
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 bg-white border-b border-gray-200">
      
      {/* 1. Ô Tìm Kiếm */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Tìm kiếm công việc..." 
          className="pl-9 h-9 text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* 2. Các Bộ Lọc */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
        
        {/* Nút "Việc của tôi" */}
        <Button 
          variant={filterMyTasks ? "primary" : "outline"} 
          size="sm"
          onClick={onToggleMyTasks}
          className={`flex items-center gap-2 whitespace-nowrap ${filterMyTasks ? 'bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200' : 'text-gray-600 border-dashed'}`}
        >
          <User size={14} />
          {filterMyTasks ? "Đang hiện: Của tôi" : "Việc của tôi"}
        </Button>

        <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

        {/* Lọc theo Priority */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 uppercase font-bold mr-1 hidden sm:inline">Ưu tiên:</span>
          {['URGENT', 'HIGH'].map(p => (
            <button
              key={p}
              onClick={() => onFilterPriority(p)}
              className={`px-2 py-1 rounded text-xs font-bold border transition-all ${
                filterPriority === p 
                  ? (p === 'URGENT' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-orange-100 text-orange-700 border-orange-200')
                  : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          {/* Nút xóa lọc priority */}
          {filterPriority && (
            <button 
                onClick={() => onFilterPriority(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                title="Xóa lọc ưu tiên"
            >
                <X size={14}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardToolbar;