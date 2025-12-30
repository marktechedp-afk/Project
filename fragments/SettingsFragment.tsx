
import React, { useState } from 'react';

interface SettingsFragmentProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onNavigateToManagement: () => void;
}

const SettingsFragment: React.FC<SettingsFragmentProps> = ({ isDarkMode, setIsDarkMode, onNavigateToManagement }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleResetData = () => {
    if (confirm("Reset database? Semua data mahasiswa akan kembali ke pengaturan awal.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const steps = [
    {
      title: "1. Push Kode ke Repo",
      desc: "Ketik perintah git push di VS Code Anda.",
      uiSim: (
        <div className="bg-slate-900 rounded-lg p-3 font-mono text-[9px] text-green-400 border border-slate-700">
          <p>$ git add .</p>
          <p>$ git commit -m "Update app"</p>
          <p>$ git push origin main</p>
          <p className="text-blue-400 mt-1">Total 12, done. ✅</p>
        </div>
      )
    },
    {
      title: "2. Klik Tab Actions",
      desc: "Buka GitHub di browser, pilih menu Actions.",
      uiSim: (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-50 p-2 flex gap-3 border-b text-[8px] font-bold text-gray-400">
            <span>Code</span> <span>Issues</span> <span className="text-blue-600 border-b border-blue-600">Actions</span>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
              <div className="h-2 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded"></div>
          </div>
        </div>
      )
    },
    {
      title: "3. Download APK",
      desc: "Cek bagian Artifacts di bawah halaman.",
      uiSim: (
        <div className="bg-white border rounded-lg p-3 shadow-sm">
          <p className="text-[9px] font-bold mb-2">Artifacts</p>
          <div className="flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-100">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-box text-blue-500 text-[10px]"></i>
              <span className="text-[8px] font-black text-blue-700">ubaya-student-hub-apk</span>
            </div>
            <i className="fa-solid fa-download text-blue-500 text-[10px]"></i>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-full p-6 space-y-8 overflow-y-auto custom-scroll pb-24">
      {/* Visual Build Guide Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <i className="fa-solid fa-microchip"></i>
            Build Center
          </h3>
          <button 
            onClick={() => setShowTutorial(true)}
            className="text-[10px] font-bold text-white bg-blue-600 px-4 py-2 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-image mr-1"></i> Panduan Visual
          </button>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Status: <span className="text-green-500 font-bold">Cloud Builder Ready</span>. Gunakan GitHub Actions jika laptop Anda tidak sanggup menjalankan Android Studio.
          </p>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 h-1.5 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kustomisasi</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-orange-50 text-orange-600'}`}>
                <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i>
              </div>
              <span className="text-sm font-black">Mode Malam</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={(e) => setIsDarkMode(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button onClick={onNavigateToManagement} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <i className="fa-solid fa-database"></i>
              </div>
              <span className="text-sm font-black">Database Mahasiswa</span>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Danger Zone</h3>
        <button onClick={handleResetData} className="w-full flex items-center gap-4 p-5 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20 text-red-600">
          <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <i className="fa-solid fa-trash-can"></i>
          </div>
          <span className="text-sm font-black">Reset Aplikasi</span>
        </button>
      </div>

      {/* Visual Guide Modal */}
      {showTutorial && (
        <div className="absolute inset-0 bg-slate-950/90 z-[200] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300 border border-white/10 flex flex-col max-h-[90%]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">GitHub Manual 📦</h3>
              <button onClick={() => setShowTutorial(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-full">
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scroll">
              {steps.map((step, idx) => (
                <div key={idx} className={`space-y-3 transition-all duration-500 ${activeStep === idx ? 'opacity-100' : 'opacity-40 grayscale'}`} onClick={() => setActiveStep(idx)}>
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${activeStep === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase">{step.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                  <div className={`transition-all duration-300 transform ${activeStep === idx ? 'scale-100' : 'scale-95'}`}>
                    {step.uiSim}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-2">
               <button 
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                className="px-4 py-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-black text-[10px] uppercase"
               >
                Prev
               </button>
               <button 
                onClick={() => activeStep === steps.length - 1 ? setShowTutorial(false) : setActiveStep(prev => prev + 1)}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-blue-500/30"
               >
                {activeStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-8 pb-4 text-center">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">Ubaya Student Hub • Final Exam</p>
        <p className="text-[9px] text-gray-300 mt-1">Teknik Informatika Ubaya © 2024</p>
      </div>
    </div>
  );
};

export default SettingsFragment;
