
import React, { useState, useEffect, useRef } from 'react';
import { Student, ProgramType } from '../types';
import { mockApiService } from '../mockApi';
import { GoogleGenAI } from "@google/genai";

interface DetailFragmentProps {
  nrp: string;
  onBack: () => void;
}

const DetailFragment: React.FC<DetailFragmentProps> = ({ nrp, onBack }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'course' | 'exp' | 'ai'>('about');
  const [showModal, setShowModal] = useState(false);
  const [totalFriends, setTotalFriends] = useState(0);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockApiService.getStudentById(nrp);
      const friendStatus = await mockApiService.checkIsFriend(nrp);
      setStudent(data || null);
      setIsFriend(friendStatus);
      setLoading(false);
    };
    fetchData();
  }, [nrp]);

  const generateAiInsight = async () => {
    if (!student || aiInsight) return;
    setIsGeneratingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on this student's profile, generate a brief, professional career insight summary (max 100 words).
      Name: ${student.nama}
      Program: ${student.program}
      About: ${student.aboutMe}
      Courses: ${student.myCourse}
      Experiences: ${student.myExperiences}
      Focus on their unique strengths and suggest 2 potential job roles.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "Unable to generate insight at this time.");
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiInsight("Error generating career insight. Please check your connection.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai' && !aiInsight) {
      generateAiInsight();
    }
  }, [activeTab]);

  const handleRequestFriend = async () => {
    if (!student) return;
    const result = await mockApiService.addFriend(student.nrp);
    if (result.success) {
      setIsFriend(true);
      setTotalFriends(result.total);
      setShowModal(true);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && student) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setStudent({ ...student, photoUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">Student not found</h2>
        <button onClick={onBack} className="mt-4 text-blue-500">Go Back</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800">
      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />

      <div className="px-4 py-2 flex items-center gap-4 border-b dark:border-slate-700">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="font-bold text-lg">Student Profile</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll px-6 pb-6">
        <div className="flex items-start gap-5 mt-6">
          <div className="relative group">
            <img src={student.photoUrl} alt={student.nama} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700" />
            <button onClick={triggerFileUpload} className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-90 transition-all border-2 border-white dark:border-slate-800">
              <i className="fa-solid fa-camera text-xs"></i>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">{student.nama}</h2>
            <div className="mt-2 space-y-0.5">
               <p className="text-xs text-gray-400 flex items-center gap-1.5"><i className="fa-solid fa-id-card w-3"></i> NRP {student.nrp}</p>
               <p className="text-xs text-gray-400 flex items-center gap-1.5"><i className="fa-solid fa-envelope w-3"></i> {student.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-xl overflow-x-auto custom-scroll">
             {(['about', 'course', 'exp', 'ai'] as const).map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition-all ${activeTab === t ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
                >
                  {t === 'ai' ? '✨ AI Insight' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
             ))}
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 min-h-[140px] relative">
             {activeTab === 'ai' ? (
                isGeneratingAi ? (
                  <div className="flex flex-col items-center justify-center h-full py-6 space-y-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-medium text-blue-500 animate-pulse">Analyzing profile with AI...</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fa-solid fa-wand-magic-sparkles text-blue-500 text-xs"></i>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Career Prediction</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {aiInsight || "Click to generate professional career insight."}
                    </p>
                  </div>
                )
             ) : (
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 italic">
                  {activeTab === 'about' ? student.aboutMe : activeTab === 'course' ? student.myCourse : student.myExperiences}
                </p>
             )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-graduation-cap text-blue-500"></i>
            Major
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(ProgramType).map(p => (
              <div 
                key={p} 
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${student.program === p ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ring-1 ring-blue-500/20' : 'bg-transparent border-gray-100 dark:border-slate-700 opacity-50'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${student.program === p ? 'border-blue-600' : 'border-gray-300'}`}>
                  {student.program === p && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                </div>
                <span className={`text-[11px] font-bold ${student.program === p ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400'}`}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <button 
            disabled={isFriend}
            onClick={handleRequestFriend}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${isFriend ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95'}`}
          >
            {isFriend ? '✓ Friends' : 'Request Friend'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-check text-2xl"></i>
            </div>
            <h3 className="text-xl font-black mb-2">Connected!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You are now friends with <span className="font-bold text-gray-800 dark:text-white">{student.nama}</span>.
            </p>
            <p className="text-sm text-blue-600 font-bold mt-4 mb-8">
              Total Friends: {totalFriends}
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailFragment;
