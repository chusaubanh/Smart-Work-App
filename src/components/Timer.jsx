import React from 'react';
import { Play, Pause, Square, User, FileText, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Timer({ 
  timerState, 
  onStart, 
  onPause, 
  onStop, 
  taskData, 
  setTaskData 
}) {
  const { isRunning, elapsedTime, displayTime } = timerState;

  return (
    <div className="w-[420px] p-8 border-r border-slate-100 flex flex-col bg-white">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
        <ClipboardList className="w-3.5 h-3.5" />
        Thông tin nhiệm vụ
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700 ml-1">Tên nhiệm vụ</label>
          <input 
            type="text" 
            placeholder="VD: Lên kịch bản nội dung..."
            className="input-field"
            value={taskData.name}
            onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700 ml-1">Chi tiết công việc <span className="text-slate-400 font-normal">(Bắt buộc)</span></label>
          <textarea 
            rows="3"
            placeholder="VD: Viết kịch bản đoạn 1..."
            className="input-field resize-none"
            value={taskData.details}
            onChange={(e) => setTaskData({ ...taskData, details: e.target.value })}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700 ml-1">Người thực hiện</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tên của bạn"
              className="input-field pl-11"
              value={taskData.assignee}
              onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
              disabled={isRunning}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className={cn(
          "font-mono-jb text-[3.8rem] font-bold tracking-tighter transition-all duration-500",
          isRunning 
            ? "bg-gradient-to-br from-sky-deep via-teal-pastel to-mint-deep bg-clip-text text-transparent scale-110" 
            : "text-slate-800"
        )}>
          {displayTime}
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">
          {isRunning ? "Đang ghi nhận thời gian..." : "Sẵn sàng để bắt đầu tập trung"}
        </p>
      </div>

      <div className="mt-auto flex gap-3">
        {!isRunning && elapsedTime === 0 ? (
          <button 
            onClick={onStart}
            className="flex-1 btn-gradient py-4 rounded-xl flex items-center justify-center gap-2 group"
          >
            <Play className="w-5 h-5 fill-current" />
            Bắt đầu
          </button>
        ) : (
          <>
            <button 
              onClick={onPause}
              className="flex-1 bg-amber-100 text-amber-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors"
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isRunning ? "Tạm dừng" : "Tiếp tục"}
            </button>
            <button 
              onClick={onStop}
              className="flex-[1.5] bg-rose-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
            >
              <Square className="w-5 h-5 fill-current" />
              Kết thúc & Lưu
            </button>
          </>
        )}
      </div>
    </div>
  );
}
