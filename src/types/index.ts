export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'tester';
  avatar?: string;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  project: string;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  estimatedTime?: number;
  actualTime?: number;
  screenshots?: string[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}