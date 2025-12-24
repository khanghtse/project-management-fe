import { X } from 'lucide-react';
import React from 'react'
import { cn } from '../../libs/utils';

const Modal = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      {/* - max-h-[90vh]: Giới hạn chiều cao 90% màn hình
         - flex flex-col: Để chia Header, Body, Footer
      */}
      <div className={cn(
          "w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200", 
          className
      )}>
        
        {/* --- HEADER (Fixed) --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* --- BODY (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal