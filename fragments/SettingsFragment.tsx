
import React, { useState, useEffect } from 'react';

interface SettingsFragmentProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onNavigateToManagement: () => void;
}

const SettingsFragment: React.FC<SettingsFragmentProps> = ({ isDarkMode, setIsDarkMode, onNavigateToManagement }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBuildDashboard, setShowBuildDashboard] = useState(false);
  const [buildType, setBuildType] = useState<'local' | 'online'>('local');

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Teks disalin!');
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto custom-scroll pb-24">
      {/* Build Dashboard - KHUSUS UNTUK VS CODE KE APK */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
          <i className="fa-solid fa-screwdriver-wrench"></i>
          Build APK Dashboard
        </h3>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 dark:bg-slate-900/50 flex gap-2">
            <button 
              onClick={() => setBuildType('local')}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${buildType === 'local' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Offline (Studio)
            </button>
            <button 
              onClick={() => setBuildType('online')}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${buildType === 'online' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Online (GitHub)
            </button>
          </div>

          <div className="p-5 space-y-5">
            {buildType === 'local' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                  <p className="text-[10px] font-black text-red-600 uppercase">Solusi Eror 'await'</p>
                  <p className="text-[10px] text-red-500/80 leading-relaxed mt-1">Update Node.js ke versi 20+ di <b>nodejs.org</b> untuk memperbaiki SyntaxError di VS Code.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Terminal VS Code:</p>
                  <div className="flex items-center justify-between bg-black/5 p-2 rounded-lg">
                    <code className="text-[10px] text-blue-600">npm run build:android</code>
                    <button onClick={() => copyToClipboard('npm run build:android')} className="text-gray-400"><i className="fa-regular fa-copy"></i></button>
                  </div>
                  <div className="flex items-center justify-between bg-black/5 p-2 rounded-lg">
                    <code className="text-[10px] text-blue-600">npx cap open android</code>
                    <button onClick={() => copyToClipboard('npx cap open android')} className="text-gray-400"><i className="fa-regular fa-copy"></i></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Gunakan <b>GitHub Actions</b> untuk build APK secara otomatis di server cloud.
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Buat folder <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">.github/workflows</code> di VS Code.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Buat file <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">android.yml</code> dan tempel kode workflow.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400"><b>Push</b> kode ke repo GitHub Anda.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold shrink-0">4</div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Cek tab <b>Actions</b> di GitHub, tunggu selesai, lalu download APK-nya.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i>
              </div>
              <span className="text-sm font-semibold">Night Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button 
            onClick={onNavigateToManagement}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <i className="fa-solid fa-database"></i>
              </div>
              <span className="text-sm font-semibold">Student Database</span>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="pt-10 pb-4 text-center">
        <p className="text-[10px] text-gray-400 font-medium">Informatics Ubaya • Mobile Programming</p>
        <p className="text-[9px] text-gray-300 mt-1 uppercase tracking-widest">Version 1.6.0-CLOUD</p>
      </div>
    </div>
  );
};

export default SettingsFragment;
