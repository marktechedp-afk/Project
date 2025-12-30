
import React, { useState, useEffect, useMemo } from 'react';
import { Student, ProgramType } from '../types';
import { mockApiService } from '../mockApi';

interface HomeFragmentProps {
  onSelectStudent: (nrp: string) => void;
}

const HomeFragment: React.FC<HomeFragmentProps> = ({ onSelectStudent }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    mockApiService.getAllStudents().then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(ProgramType).forEach(p => counts[p] = 0);
    students.forEach(s => {
      if (counts[s.program] !== undefined) counts[s.program]++;
    });
    return counts;
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nrp.includes(searchQuery) ||
      s.program.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Loading Hub...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input 
            type="text" 
            placeholder="Search name, NRP, or major..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-slate-800 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll pb-10">
        {/* Quick Stats Section */}
        {!searchQuery && (
          <div className="px-6 mb-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Major Distribution</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scroll no-scrollbar">
              {Object.entries(stats).map(([program, count]) => (
                <div key={program} className="flex-shrink-0 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-2xl min-w-[90px] shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400">{program}</p>
                  <p className="text-xl font-black text-blue-600 mt-1">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {searchQuery ? `Results (${filteredStudents.length})` : 'All Students'}
          </h3>
          
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div 
                key={student.nrp}
                onClick={() => onSelectStudent(student.nrp)}
                className="group bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/50 transition-all cursor-pointer flex gap-4 transform active:scale-[0.97]"
              >
                <div className="relative">
                  <img 
                    src={student.photoUrl} 
                    alt={student.nama} 
                    className="w-20 h-20 rounded-2xl object-cover bg-gray-50 shadow-sm transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="text-lg font-black text-gray-800 dark:text-white leading-tight">{student.nama}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">NRP • {student.nrp}</p>
                  <div className="mt-3">
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-[9px] font-black text-blue-600 dark:text-blue-400 rounded-lg uppercase">
                      {student.program}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-magnifying-glass text-2xl text-gray-200"></i>
              </div>
              <p className="text-sm font-bold text-gray-400">No students matching your search</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-xs font-bold text-blue-600 uppercase tracking-widest"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeFragment;
