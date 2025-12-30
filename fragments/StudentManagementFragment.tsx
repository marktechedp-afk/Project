
import React, { useState, useEffect } from 'react';
import { Student, ProgramType } from '../types';
import { mockApiService } from '../mockApi';
import { GoogleGenAI } from "@google/genai";

interface StudentManagementFragmentProps {
  onBack: () => void;
}

const StudentManagementFragment: React.FC<StudentManagementFragmentProps> = ({ onBack }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefining, setIsRefining] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Student>({
    nama: '',
    nrp: '',
    email: '',
    program: ProgramType.DSAI,
    aboutMe: '',
    myCourse: '',
    myExperiences: '',
    photoUrl: 'https://picsum.photos/seed/new/200/200'
  });

  const loadStudents = async () => {
    setLoading(true);
    const data = await mockApiService.getAllStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      nama: '',
      nrp: '',
      email: '',
      program: ProgramType.DSAI,
      aboutMe: '',
      myCourse: '',
      myExperiences: '',
      photoUrl: `https://picsum.photos/seed/${Date.now()}/200/200`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleDelete = async (nrp: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await mockApiService.deleteStudent(nrp);
      loadStudents();
    }
  };

  const refineTextWithAi = async (field: keyof Student) => {
    const currentValue = formData[field] as string;
    if (!currentValue || currentValue.length < 5) {
      alert("Please enter some text first for the AI to refine.");
      return;
    }

    setIsRefining(field);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Refine the following ${field === 'aboutMe' ? 'profile bio' : field === 'myExperiences' ? 'professional experiences' : 'course list'} to make it sound more professional, academic, and engaging for a university student hub. Keep the core information but improve the flow and vocabulary. Limit to 3-4 sentences.
      Text: ${currentValue}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      if (response.text) {
        setFormData(prev => ({ ...prev, [field]: response.text.trim() }));
      }
    } catch (error) {
      console.error("AI Refinement Error:", error);
      alert("Failed to refine text. Please try again.");
    } finally {
      setIsRefining(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      await mockApiService.updateStudent(editingStudent.nrp, formData);
    } else {
      const success = await mockApiService.addStudent(formData);
      if (!success) {
        alert('NRP already exists!');
        return;
      }
    }
    setIsModalOpen(false);
    loadStudents();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      <div className="px-4 py-2 flex items-center justify-between border-b dark:border-slate-800 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <span className="font-bold">Database</span>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <i className="fa-solid fa-plus"></i> Add New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          students.map(s => (
            <div key={s.nrp} className="bg-white dark:bg-slate-800 p-3 rounded-xl border dark:border-slate-700 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <img src={s.photoUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">{s.nama}</h4>
                <p className="text-[10px] text-gray-500">{s.nrp} • <span className="text-blue-500 font-semibold">{s.program}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(s)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 text-blue-600 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                  <i className="fa-solid fa-pen text-xs"></i>
                </button>
                <button onClick={() => handleDelete(s.nrp)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 text-red-500 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                  <i className="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md h-[92%] sm:h-auto sm:max-h-[85%] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
              <h3 className="font-bold">{editingStudent ? 'Edit Student' : 'New Student'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-400"><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scroll">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <input required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Enter full name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NRP (ID)</label>
                  <input required disabled={!!editingStudent} value={formData.nrp} onChange={e => setFormData({...formData, nrp: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" placeholder="e.g. 160421001" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Program</label>
                  <select value={formData.program} onChange={e => setFormData({...formData, program: e.target.value as ProgramType})} className="w-full bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500">
                    {Object.values(ProgramType).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500" placeholder="student@ubaya.ac.id" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">About Me</label>
                  <button type="button" onClick={() => refineTextWithAi('aboutMe')} className="text-[10px] font-bold text-blue-500 flex items-center gap-1 hover:text-blue-600 transition-colors">
                    {isRefining === 'aboutMe' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>} 
                    Refine with AI
                  </button>
                </div>
                <textarea rows={3} value={formData.aboutMe} onChange={e => setFormData({...formData, aboutMe: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500" placeholder="Tell us about yourself..." />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experiences</label>
                  <button type="button" onClick={() => refineTextWithAi('myExperiences')} className="text-[10px] font-bold text-blue-500 flex items-center gap-1 hover:text-blue-600 transition-colors">
                    {isRefining === 'myExperiences' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>} 
                    Refine with AI
                  </button>
                </div>
                <textarea rows={2} value={formData.myExperiences} onChange={e => setFormData({...formData, myExperiences: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500" placeholder="Internships, leadership, projects..." />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Photo URL</label>
                <input required value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500" placeholder="Image URL" />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
                {editingStudent ? 'Update Profile' : 'Register Student'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagementFragment;
