
import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../types';
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
        <p className="text-gray-500 text-sm">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input 
            type="text" 
            placeholder="Search name, NRP, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-slate-700 border-0 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div 
              key={student.nrp}
              onClick={() => onSelectStudent(student.nrp)}
              className="bg-white dark:bg-slate-700 rounded-2xl border border-gray-100 dark:border-slate-600 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <img 
                src={student.photoUrl} 
                alt={student.nama} 
                className="w-20 h-20 rounded-xl object-cover bg-gray-100 shadow-sm"
              />
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold leading-tight">{student.nama}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">NRP {student.nrp}</p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 rounded-lg">
                    {student.program}
                  </span>
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <i className="fa-solid fa-chevron-right text-gray-300"></i>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <i className="fa-solid fa-user-slash text-4xl mb-4 opacity-20"></i>
            <p className="text-sm">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeFragment;
