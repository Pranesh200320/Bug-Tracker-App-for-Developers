import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bug, Comment } from '../types';

interface BugContextType {
  bugs: Bug[];
  addBug: (bug: Omit<Bug, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateBug: (id: string, updates: Partial<Bug>) => void;
  addComment: (bugId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getBugsByStatus: (status: Bug['status']) => Bug[];
  getBugsBySeverity: (severity: Bug['severity']) => Bug[];
  getBugsByAssignee: (assigneeId: string) => Bug[];
}

const BugContext = createContext<BugContextType | undefined>(undefined);

// Mock data
const mockBugs: Bug[] = [
  {
    id: '1',
    title: 'Login button not responsive on mobile',
    description: 'The login button becomes unclickable on screens smaller than 768px',
    severity: 'high',
    status: 'open',
    priority: 'high',
    project: 'Web App',
    reportedBy: '3',
    assignedTo: '2',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    comments: [],
    estimatedTime: 4,
  },
  {
    id: '2',
    title: 'Database connection timeout',
    description: 'Users experiencing timeouts when accessing user profiles',
    severity: 'critical',
    status: 'in-progress',
    priority: 'high',
    project: 'Backend API',
    reportedBy: '3',
    assignedTo: '2',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    comments: [
      {
        id: '1',
        text: 'Looking into the connection pool settings',
        author: '2',
        createdAt: '2024-01-15T09:15:00Z',
      },
    ],
    estimatedTime: 8,
    actualTime: 3,
  },
  {
    id: '3',
    title: 'Typography inconsistency in headers',
    description: 'H2 and H3 tags have inconsistent font weights across pages',
    severity: 'low',
    status: 'resolved',
    priority: 'low',
    project: 'Web App',
    reportedBy: '3',
    assignedTo: '2',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
    comments: [],
    estimatedTime: 2,
    actualTime: 1,
  },
];

export function BugProvider({ children }: { children: ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>(mockBugs);

  const addBug = (bugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newBug: Bug = {
      ...bugData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    setBugs(prev => [...prev, newBug]);
  };

  const updateBug = (id: string, updates: Partial<Bug>) => {
    setBugs(prev => prev.map(bug => 
      bug.id === id 
        ? { ...bug, ...updates, updatedAt: new Date().toISOString() }
        : bug
    ));
  };

  const addComment = (bugId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setBugs(prev => prev.map(bug =>
      bug.id === bugId
        ? { 
            ...bug, 
            comments: [...bug.comments, newComment],
            updatedAt: new Date().toISOString()
          }
        : bug
    ));
  };

  const getBugsByStatus = (status: Bug['status']) => {
    return bugs.filter(bug => bug.status === status);
  };

  const getBugsBySeverity = (severity: Bug['severity']) => {
    return bugs.filter(bug => bug.severity === severity);
  };

  const getBugsByAssignee = (assigneeId: string) => {
    return bugs.filter(bug => bug.assignedTo === assigneeId);
  };

  return (
    <BugContext.Provider value={{
      bugs,
      addBug,
      updateBug,
      addComment,
      getBugsByStatus,
      getBugsBySeverity,
      getBugsByAssignee,
    }}>
      {children}
    </BugContext.Provider>
  );
}

export function useBugs() {
  const context = useContext(BugContext);
  if (context === undefined) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
}