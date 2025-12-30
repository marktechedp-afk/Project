
import React, { useState, useEffect } from 'react';

interface SettingsFragmentProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onNavigateToManagement: () => void;
}

const SettingsFragment: React.FC<SettingsFragmentProps> = ({ isDarkMode, setIsDarkMode, onNavigateToManagement }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [buildType, setBuildType] = useState<'local' | 'online'>('local');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Command copied to clipboard!');
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This will clear the student database and friend list to initial defaults.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tutorialSteps = [
    { icon: 'fa-cloud-arrow-up', title: '1. Push Code', desc: 'Run git push origin main in your VS Code terminal.' },
    { icon: 'fa-play-circle', title: '2. Open Actions', desc: 'Visit the "Actions" tab in your GitHub repository.' },
    { icon: 'fa-circle-check', title: '3. Wait for Build', desc: 'Usually takes 3-5 minutes. Look for the green checkmark.' },
    { icon: 'fa-box-open', title: '4. Download APK', desc: 'Find "Artifacts" at the bottom of the page and download.' }
  ];

  return (
    <div className="h-full p-6 space-y-8 overflow-y-auto custom-scroll pb-24">
      {/* Build Dashboard */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <i className="fa-solid fa-screwdriver-wrench"></i>
            APK Build Center
          </h3>
          <button 
            onClick={() => setShowTutorial(true)}
            className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl active:scale-95 transition-all"
          >
            <i className="fa-solid fa-circle-question mr-1"></i> Help
          </button>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 dark:bg-slate-900/50 flex gap-2">
            <button 
              onClick={() => setBuildType('local')}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-2xl transition-all ${buildType === 'local' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}
            >
              Offline Build
            </button>
            <button 
              onClick={() => setBuildType('online')}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-2xl transition-all ${buildType === 'online' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400'}`}
            >
              Online Build
            </button>
          </div>

          <div className="p-6 space-y-5">
            {buildType === 'local' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                  <p className="text-[10px] font-black text-orange-600 uppercase">Local Requirement</p>
                  <p className="text-[11px] text-orange-700/80 leading-relaxed mt-1 font-medium">Requires Android Studio & Node.js 20+ installed on your laptop.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all group">
                    <code className="text-[11px] font-mono text-blue-600 dark:text-blue-400">npm run build:android</code>
                    <button onClick={() => copyToClipboard('npm run build:android')} className="text-gray-400 group-hover:text-blue-500"><i className="fa-regular fa-copy text-xs"></i></button>
                  </div>
                  <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all group">
                    <code className="text-[11px] font-mono text-blue-600 dark:text-blue-400">npx cap open android</code>
                    <button onClick={() => copyToClipboard('npx cap open android')} className="text-gray-400 group-hover:text-blue-500"><i className="fa-regular fa-copy text-xs"></i></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Automated cloud builds via <span className="text-indigo-600 font-bold">GitHub Actions</span>. No local software required.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-xs font-black">1</div>
                    <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Push to main branch</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-xs font-black">2</div>
                    <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Check Actions tab</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xs font-black">3</div>
                    <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Collect APK artifact</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Preferences */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Application</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-orange-50 text-orange-600'}`}>
                <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i>
              </div>
              <div>
                <span className="text-sm font-black block">Night Mode</span>
                <span className="text-[10px] text-gray-400">Switch app colors</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button 
            onClick={onNavigateToManagement}
            className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <i className="fa-solid fa-database"></i>
              </div>
              <div className="text-left">
                <span className="text-sm font-black block">Student Database</span>
                <span className="text-[10px] text-gray-400">Manage all profiles</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-200 group-hover:text-blue-500 text-xs transition-colors"></i>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Danger Zone</h3>
        <button 
          onClick={handleResetData}
          className="w-full flex items-center justify-between p-5 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20 active:scale-95 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <div className="text-left">
              <span className="text-sm font-black text-red-600 block">Reset Application</span>
              <span className="text-[10px] text-red-400">Wipe all local changes</span>
            </div>
          </div>
        </button>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="absolute inset-0 bg-slate-950/80 z-[200] flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300 border border-white/10">
            <h3 className="text-2xl font-black text-center mb-2">Build Guide 🚀</h3>
            <p className="text-[11px] text-center text-gray-400 mb-10 font-medium">Follow these steps to generate your APK</p>
            <div className="space-y-8">
              {tutorialSteps.map((step, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                    <i className={`fa-solid ${step.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">{step.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-1 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowTutorial(false)}
              className="w-full mt-12 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
            >
              Got it, let's build!
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-12 pb-6 text-center">
        <div className="flex justify-center gap-4 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
        </div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">Student Hub • Final Project</p>
        <p className="text-[9px] text-gray-300 mt-1">Informatics Engineering Ubaya © 2024</p>
      </div>
    </div>
  );
};

export default SettingsFragment;
