
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { mockApiService } from '../mockApi';

const FriendsFragment: React.FC = () => {
  const [friends, setFriends] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApiService.getFriends().then(data => {
      setFriends(data);
      setLoading(false);
    });
  }, []);

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}?subject=Hello Friend!&body=Hi, how are you?`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-user-plus text-blue-500 text-2xl"></i>
        </div>
        <h3 className="text-lg font-bold">No Friends Yet</h3>
        <p className="text-sm text-gray-500 mt-2">Go to the home screen and request some friends to see them here.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scroll p-4 space-y-4">
      {friends.map((friend) => (
        <div 
          key={friend.nrp}
          className="bg-white dark:bg-slate-700 rounded-2xl border border-gray-100 dark:border-slate-600 p-4 shadow-sm flex gap-4"
        >
          <img 
            src={friend.photoUrl} 
            alt={friend.nama} 
            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
          />
          <div className="flex flex-col justify-center flex-1">
            <h3 className="text-md font-bold leading-tight">{friend.nama}</h3>
            <p className="text-[10px] text-gray-500 mt-1">NRP {friend.nrp}</p>
            <p className="text-[10px] font-semibold text-blue-600">Program {friend.program}</p>
          </div>
          <button 
            onClick={() => handleSendEmail(friend.email)}
            className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-600 text-blue-600 dark:text-blue-400 flex items-center justify-center self-center hover:bg-blue-100 transition-colors"
          >
            <i className="fa-solid fa-envelope"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendsFragment;
