
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Complaint, ComplaintStatus, Community } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize mock data
  useEffect(() => {
    const savedUser = localStorage.getItem('zenitsu_user');
    const savedComplaints = localStorage.getItem('zenitsu_complaints');
    const savedCommunities = localStorage.getItem('zenitsu_communities');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
    if (savedCommunities) setCommunities(JSON.parse(savedCommunities));

    setIsLoading(false);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('zenitsu_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('zenitsu_communities', JSON.stringify(communities));
  }, [communities]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('zenitsu_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zenitsu_user');
  };

  const addComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const createCommunity = (name: string) => {
    if (!user) return;
    const newComm: Community = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      adminId: user.id,
      memberIds: [user.id]
    };
    setCommunities(prev => [...prev, newComm]);
    // Auto-assign user to their new community
    setUser(prev => prev ? { ...prev, communityId: newComm.id } : null);
  };

  const addUserToCommunity = (communityId: string, userEmail: string) => {
    // In a real app, we'd search for the user. Here we'll simulate.
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        return { ...c, memberIds: [...c.memberIds, `user_${Math.random()}`] };
      }
      return c;
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-4xl font-orbitron animate-flicker">THUNDER BREATHING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 zenitsu-pattern pointer-events-none"></div>
      
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <main className="container mx-auto px-4 py-8 relative z-10">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : user.role === UserRole.ADMIN ? (
          <AdminDashboard 
            user={user} 
            complaints={complaints.filter(c => c.communityId === user.communityId)} 
            communities={communities}
            onUpdateStatus={updateComplaintStatus}
            onCreateCommunity={createCommunity}
            onAddUser={addUserToCommunity}
          />
        ) : (
          <Dashboard 
            user={user} 
            complaints={complaints.filter(c => c.userId === user.id)} 
            communities={communities}
            onAddComplaint={addComplaint}
          />
        )}
      </main>
    </div>
  );
};

export default App;
