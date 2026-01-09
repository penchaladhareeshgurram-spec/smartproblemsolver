
export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  communityId?: string;
}

export interface Community {
  id: string;
  name: string;
  adminId: string;
  memberIds: string[];
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  image?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: ComplaintStatus;
  timestamp: number;
  communityId: string;
}
