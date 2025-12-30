
import React, { useState, useEffect } from 'react';
import { ProgramType, Student } from './types';
import { mockApiService } from './mockApi';
import HomeFragment from './fragments/HomeFragment';
import FriendsFragment from './fragments/FriendsFragment';
import SettingsFragment from './fragments/SettingsFragment';
import DetailFragment from './fragments/DetailFragment';
import StudentManagementFragment from './fragments/StudentManagementFragment';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'night';
  });
  const [selectedStudentNrp, setSelectedStudentNrp] = useState<string | null>(null);
  const [isManagingStudents, setIsManagingStudents] = useState<boolean>(false);
  const [isSplashScreen, setIsSplashScreen] = useState<boolean>(true);

  // Sync theme with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'night');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setIsSplashScreen(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const navigateToDetail = (nrp: string) => {
    setSelectedStudentNrp(nrp);
  };

  const goBackFromDetail = () => {
    setSelectedStudentNrp(null);
  };

  const renderContent = () => {
    if (selectedStudentNrp) {
      return (
        <DetailFragment 
          nrp={selectedStudentNrp} 
          onBack={goBackFromDetail}
        />
      );
    }

    if (isManagingStudents) {
      return (
        <StudentManagementFragment 
          onBack={() => setIsManagingStudents(false)} 
        />
      );
    }

    switch (activeTab) {
      case 0: return <HomeFragment onSelectStudent={navigateToDetail} />;
      case 1: return <FriendsFragment />;
      case 2: return <SettingsFragment 
                        isDarkMode={isDarkMode} 
                        setIsDarkMode={setIsDarkMode} 
                        onNavigateToManagement={() => setIsManagingStudents(true)}
                      />;
      default: return <HomeFragment onSelectStudent={navigateToDetail} />;
    }
  };

  if (isSplashScreen) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-blue-600">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
             <i className="fa-solid fa-graduation-cap text-4xl text-blue-600"></i>
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">Ubaya Student Hub</h1>
          <p className="text-blue-200 text-xs mt-2 uppercase tracking-widest font-bold">Informatics Engineering</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
      {/* Mobile Mock Container */}
      <div className={`relative w-full max-w-md h-full md:h-[844px] md:rounded-[3.5rem] md:border-[12px] md:border-slate-900 shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between px-8 pt-6 pb-2 bg-transparent shrink-0">
          <span className="text-sm font-bold">10:40</span>
          <div className="flex gap-1.5 items-center">
            <i className="fa-solid fa-signal text-[10px]"></i>
            <i className="fa-solid fa-wifi text-[10px]"></i>
            <div className="w-6 h-3 border border-current rounded-sm flex items-center px-0.5 ml-1">
               <div className="h-1.5 w-full bg-current rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Header */}
        {!selectedStudentNrp && !isManagingStudents && (
          <div className="px-6 pt-4 pb-2 shrink-0">
            <h1 className="text-3xl font-black tracking-tight">
              {activeTab === 0 ? 'Students' : activeTab === 1 ? 'My Friends' : 'Settings'}
            </h1>
          </div>
        )}

        {/* Content Area (Simulating ViewPager) */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 transition-transform duration-300 transform h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderContent()}
          </div>
        </div>

        {/* Bottom Navigation */}
        {!selectedStudentNrp && !isManagingStudents && (
          <nav className="flex justify-around items-center py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-slate-800 shrink-0 px-4">
            <button 
              onClick={() => setActiveTab(0)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 0 ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className={`w-12 h-8 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 0 ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <i className="fa-solid fa-house text-lg"></i>
              </div>
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => setActiveTab(1)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 1 ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className={`w-12 h-8 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 1 ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <i className="fa-solid fa-user-group text-lg"></i>
              </div>
              <span className="text-[10px] font-bold">Friends</span>
            </button>
            <button 
              onClick={() => setActiveTab(2)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 2 ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className={`w-12 h-8 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 2 ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <i className="fa-solid fa-gear text-lg"></i>
              </div>
              <span className="text-[10px] font-bold">Settings</span>
            </button>
          </nav>
        )}

        {/* Back/Home Bar (iOS Style) */}
        <div className="h-8 flex justify-center items-center shrink-0">
          <div className="w-32 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
