import React from 'react';
import { Download, Trash2, Database, History as HistoryIcon, User, Clock, Calendar, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function History({ tasks, onDeleteTask, onExport, onClearAll, onShowArchive }) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50/40">
      <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Lịch sử
          </h2>
          <span className="px-2.5 py-0.5 bg-sky-100 text-sky-600 rounded-full text-[11px] font-bold">
            {tasks.length}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onShowArchive}
            className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-sky-500 hover:border-sky-100 hover:bg-sky-50 transition-all shadow-sm"
            title="Kho lưu trữ & Backup"
          >
            <Database className="w-4 h-4" />
          </button>
          <button 
            onClick={onExport}
            className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-emerald-500 hover:border-emerald-100 hover:bg-emerald-50 transition-all shadow-sm"
            title="Xuất báo cáo CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={onClearAll}
            className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm"
            title="Xóa tất cả"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-3">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60 mt-[-40px]">
            <HistoryIcon className="w-16 h-16 mb-4 stroke-1" />
            <p className="text-sm font-medium">Chưa có dữ liệu nhiệm vụ hôm nay</p>
            <p className="text-[11px]">Hãy bắt đầu ghi nhận thời gian làm việc!</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div 
              key={task.id}
              className="group bg-white border border-slate-200/60 rounded-xl p-4 flex items-center gap-4 transition-all hover:border-sky-200 hover:shadow-md hover:shadow-sky-500/5 hover:-translate-y-0.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-slate-800 truncate mb-0.5">{task.name}</h3>
                {task.details && (
                  <p className="text-[12px] text-slate-400 italic truncate mb-2">"{task.details}"</p>
                )}
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <span className="flex items-center gap-1.5 bg-slate-100/60 px-2 py-0.5 rounded-md group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                    <User className="w-3 h-3" /> {task.assignee}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100/60 px-2 py-0.5 rounded-md group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                    <Clock className="w-3 h-3" /> {new Date(task.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100/60 px-2 py-0.5 rounded-md group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                    <Calendar className="w-3 h-3" /> {new Date(task.timestamp).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="font-mono-jb font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-slate-600 min-w-[85px] text-center group-hover:border-sky-100 group-hover:bg-sky-50/30 group-hover:text-sky-600 transition-all">
                  {Math.floor(task.durationMs / 60000)}m {Math.floor((task.durationMs % 60000) / 1000)}s
                </div>
                <button 
                  onClick={() => onDeleteTask(index)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
