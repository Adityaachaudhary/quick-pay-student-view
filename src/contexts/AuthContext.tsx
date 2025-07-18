import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  feesPaid: boolean;
}

interface AuthContextType {
  currentUser: Student | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<Pick<Student, 'name' | 'email'>>) => Promise<boolean>;
  payFees: () => Promise<boolean>;
  getAllStudents: () => Student[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock data
const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    password: 'password123',
    feesPaid: true
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@student.edu',
    password: 'password123',
    feesPaid: false
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@student.edu',
    password: 'password123',
    feesPaid: true
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@student.edu',
    password: 'password123',
    feesPaid: false
  },
  {
    id: '5',
    name: 'Emma Brown',
    email: 'emma@student.edu',
    password: 'password123',
    feesPaid: true
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  // Initialize data from localStorage or use defaults
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      setStudents(initialStudents);
      localStorage.setItem('students', JSON.stringify(initialStudents));
    }
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Listen for storage changes (for real-time updates across tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'students') {
        const updatedStudents = e.newValue ? JSON.parse(e.newValue) : [];
        setStudents(updatedStudents);
        
        // Update current user if their data changed
        if (currentUser) {
          const updatedCurrentUser = updatedStudents.find((s: Student) => s.id === currentUser.id);
          if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
          }
        }
      }
    };

    // Also listen for custom payment events
    const handlePaymentUpdate = (e: CustomEvent) => {
      if (e.detail && currentUser && e.detail.userId === currentUser.id) {
        const updatedUser = { ...currentUser, feesPaid: true };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('paymentCompleted', handlePaymentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('paymentCompleted', handlePaymentUpdate as EventListener);
    };
  }, [currentUser]);

  const saveStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'students',
      newValue: JSON.stringify(updatedStudents)
    }));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      setCurrentUser(student);
      localStorage.setItem('currentUser', JSON.stringify(student));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    if (students.some(s => s.email === email)) {
      return false;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      email,
      password,
      feesPaid: false
    };

    const updatedStudents = [...students, newStudent];
    saveStudents(updatedStudents);
    setCurrentUser(newStudent);
    localStorage.setItem('currentUser', JSON.stringify(newStudent));
    return true;
  };

  const updateProfile = async (updates: Partial<Pick<Student, 'name' | 'email'>>): Promise<boolean> => {
    if (!currentUser) return false;

    // Check if email is being changed and already exists
    if (updates.email && updates.email !== currentUser.email) {
      if (students.some(s => s.email === updates.email && s.id !== currentUser.id)) {
        return false;
      }
    }

    const updatedUser = { ...currentUser, ...updates };
    const updatedStudents = students.map(s => 
      s.id === currentUser.id ? updatedUser : s
    );

    saveStudents(updatedStudents);
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true;
  };

  const payFees = async (): Promise<boolean> => {
    if (!currentUser) return false;

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedUser = { ...currentUser, feesPaid: true };
    const updatedStudents = students.map(s => 
      s.id === currentUser.id ? updatedUser : s
    );

    saveStudents(updatedStudents);
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Dispatch custom event for immediate UI updates
    window.dispatchEvent(new CustomEvent('paymentCompleted', {
      detail: { userId: currentUser.id }
    }));
    
    return true;
  };

  const getAllStudents = () => students;

  const value = {
    currentUser,
    login,
    logout,
    signup,
    updateProfile,
    payFees,
    getAllStudents
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};