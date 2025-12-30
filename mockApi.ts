
import { Student, Friend, ProgramType } from './types';

// Initial seed data
const INITIAL_STUDENTS: Student[] = [
  {
    nama: "Angela Wong",
    nrp: "123456678",
    email: "wong@gmail.com",
    program: ProgramType.DSAI,
    aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut justo massa, commodo eu finibus at, pulvinar quis mi. Aenean auctor iaculis sem nec condimentum. Quisque consequat sapien ut turpis tincidunt, at vulputate turpis congue. Duis bibendum congue auctor.",
    myCourse: "Machine Learning, Deep Learning, Statistics",
    myExperiences: "Intern at Google, Research Assistant at Ubaya",
    photoUrl: "https://picsum.photos/id/1027/200/200"
  },
  {
    nama: "Dean Kirkwood",
    nrp: "45235236",
    email: "dean@mail.ubaya.ac.id",
    program: ProgramType.GD,
    aboutMe: "Passionate game developer with a focus on immersive 3D experiences. I love exploring new technologies and building interactive worlds.",
    myCourse: "3D Modeling, Unity Engine, Physics Simulation",
    myExperiences: "Winner of Global Game Jam 2023, Freelance Game Designer",
    photoUrl: "https://picsum.photos/id/1005/200/200"
  },
  {
    nama: "Monica",
    nrp: "38469843",
    email: "monica.mon@ubaya.net",
    program: ProgramType.DMT,
    aboutMe: "Creative digital media technologist exploring the intersection of design and code.",
    myCourse: "UI/UX Design, Front-end Dev, Audio Engineering",
    myExperiences: "Graphic Designer at Student Union, Media Intern",
    photoUrl: "https://picsum.photos/id/1011/200/200"
  },
  {
    nama: "Julian Casablancas",
    nrp: "59928341",
    email: "jules@strokes.com",
    program: ProgramType.NCS,
    aboutMe: "Cybersecurity enthusiast focused on network defense and cloud security systems.",
    myCourse: "Network Security, Penetration Testing, Cloud Arch",
    myExperiences: "Security Consultant for Local Startup",
    photoUrl: "https://picsum.photos/id/1012/200/200"
  }
];

const STORAGE_KEY = 'ubaya_students_db';

const getStoredStudents = (): Student[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }
  return JSON.parse(stored);
};

const saveStoredStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const mockApiService = {
  getAllStudents: async (): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredStudents()), 300);
    });
  },

  getStudentById: async (nrp: string): Promise<Student | undefined> => {
    return new Promise((resolve) => {
      const student = getStoredStudents().find(s => s.nrp === nrp);
      setTimeout(() => resolve(student), 200);
    });
  },

  addStudent: async (student: Student): Promise<boolean> => {
    return new Promise((resolve) => {
      const students = getStoredStudents();
      if (students.some(s => s.nrp === student.nrp)) {
        resolve(false);
        return;
      }
      saveStoredStudents([...students, student]);
      setTimeout(() => resolve(true), 300);
    });
  },

  updateStudent: async (nrp: string, updatedData: Student): Promise<boolean> => {
    return new Promise((resolve) => {
      const students = getStoredStudents();
      const index = students.findIndex(s => s.nrp === nrp);
      if (index === -1) {
        resolve(false);
        return;
      }
      students[index] = updatedData;
      saveStoredStudents(students);
      setTimeout(() => resolve(true), 300);
    });
  },

  deleteStudent: async (nrp: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const students = getStoredStudents();
      const filtered = students.filter(s => s.nrp !== nrp);
      saveStoredStudents(filtered);
      setTimeout(() => resolve(true), 300);
    });
  },

  getFriends: async (): Promise<Student[]> => {
    return new Promise((resolve) => {
      const friendsData: Friend[] = JSON.parse(localStorage.getItem('my_friends') || '[]');
      const students = getStoredStudents();
      const friendsList = students.filter(s => friendsData.some(f => f.nrp === s.nrp));
      setTimeout(() => resolve(friendsList), 350);
    });
  },

  addFriend: async (nrp: string): Promise<{ success: boolean; total: number }> => {
    return new Promise((resolve) => {
      const currentFriends: Friend[] = JSON.parse(localStorage.getItem('my_friends') || '[]');
      if (!currentFriends.some(f => f.nrp === nrp)) {
        const newFriend: Friend = { id: Date.now(), nrp };
        const updated = [...currentFriends, newFriend];
        localStorage.setItem('my_friends', JSON.stringify(updated));
        setTimeout(() => resolve({ success: true, total: updated.length }), 300);
      } else {
        setTimeout(() => resolve({ success: false, total: currentFriends.length }), 300);
      }
    });
  },

  resetFriends: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      localStorage.removeItem('my_friends');
      setTimeout(() => resolve(true), 400);
    });
  },

  checkIsFriend: async (nrp: string): Promise<boolean> => {
    const currentFriends: Friend[] = JSON.parse(localStorage.getItem('my_friends') || '[]');
    return currentFriends.some(f => f.nrp === nrp);
  }
};
