import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Timer from './components/Timer';
import History from './components/History';
import { Moon, Sun, Monitor, AlertCircle, Zap } from 'lucide-react';

function App() {
  // --- State Initialization ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('swt_data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [archives, setArchives] = useState(() => {
    const saved = localStorage.getItem('swt_archives');
    return saved ? JSON.parse(saved) : {};
  });

  const [taskData, setTaskData] = useState({
    name: '',
    details: '',
    assignee: tasks.length > 0 ? tasks[0].assignee : ''
  });

  // --- Timer State ---
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [displayTime, setDisplayTime] = useState("00:00:00");
  const timerIntervalRef = useRef(null);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('swt_data', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('swt_archives', JSON.stringify(archives));
  }, [archives]);

  // --- Timer Logic ---
  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const currentElapsed = elapsedTime + (now - startTime);
        setDisplayTime(formatTime(currentElapsed));
      }, 100);
    } else {
      clearInterval(timerIntervalRef.current);
      setDisplayTime(formatTime(elapsedTime));
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning, elapsedTime, startTime]);

  // --- Actions ---
  const handleStart = () => {
    if (!taskData.name.trim() || !taskData.assignee.trim()) {
      alert("⚠️ Nhập Tên nhiệm vụ và Người thực hiện!");
      return;
    }
    if (!taskData.details.trim()) {
      alert("⚠️ Bắt buộc nhập Chi tiết công việc!");
      return;
    }
    setStartTime(Date.now());
    setIsRunning(true);
  };

  const handlePause = () => {
    if (isRunning) {
      setElapsedTime(prev => prev + (Date.now() - startTime));
      setIsRunning(false);
    } else {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    let totalTime = elapsedTime;
    if (isRunning) totalTime += (Date.now() - startTime);

    if (totalTime < 10000) {
      if (!confirm("Thời gian ghi nhận chưa tới 10 giây. Bạn vẫn muốn lưu chứ?")) {
        resetTimer();
        return;
      }
    }

    const newTask = {
      id: Date.now().toString(),
      name: taskData.name.trim().charAt(0).toUpperCase() + taskData.name.trim().slice(1),
      details: taskData.details.trim(),
      assignee: taskData.assignee.trim(),
      durationMs: totalTime,
      minutes: Number((totalTime / 60000).toFixed(2)),
      timestamp: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    resetTimer();
  };

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('swt_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('swt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('swt_theme', 'light');
    }
  }, [darkMode]);

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    setDisplayTime("00:00:00");
    setTaskData({ ...taskData, name: '', details: '' });
  };

  const handleDeleteTask = (index) => {
    if (confirm(`Bạn có chắc muốn xóa tác vụ: "${tasks[index].name}"?`)) {
      setTasks(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleClearAll = () => {
    if (tasks.length === 0) return;
    if (confirm(`Xóa toàn bộ ${tasks.length} tác vụ? (Dữ liệu sẽ được tự động sao lưu vào Archive)`)) {
      const archiveKey = `archive_${Date.now()}`;
      setArchives(prev => ({
        ...prev,
        [archiveKey]: {
          timestamp: new Date().toISOString(),
          label: `Dọn dẹp (${tasks.length} tác vụ)`,
          data: tasks
        }
      }));
      setTasks([]);
    }
  };

  const handleExportCSV = async () => {
    if (tasks.length === 0) {
      alert("Chưa có dữ liệu để xuất!");
      return;
    }
    
    // Auto-backup before export
    const archiveKey = `archive_${Date.now()}`;
    setArchives(prev => ({
      ...prev,
      [archiveKey]: {
        timestamp: new Date().toISOString(),
        label: 'Xuất CSV',
        data: tasks
      }
    }));

    const header = 'ID,Tên nhiệm vụ,Chi tiết,Người thực hiện,Số phút,Thời điểm';
    const rows = tasks.map(t => {
      const escape = (s) => `"${(s || '').replace(/"/g, '""')}"`;
      return `${t.id},${escape(t.name)},${escape(t.details)},${escape(t.assignee)},${t.minutes},${t.timestamp}`;
    });
    
    const csvContent = '\uFEFF' + header + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Fallback download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartWork_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-700 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
             </div>
             <h2 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">Phiên Làm Việc</h2>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors"
             >
               {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          <Timer 
            timerState={{ isRunning, elapsedTime, displayTime }}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            taskData={taskData}
            setTaskData={setTaskData}
          />
          <History 
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onExport={handleExportCSV}
            onClearAll={handleClearAll}
            onShowArchive={() => alert("Chức năng Archive sẽ được mở rộng trong phiên bản tiếp theo!")}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
