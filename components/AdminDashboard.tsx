
import React, { useState } from 'react';
import { User, Complaint, ComplaintStatus, Community } from '../types';

interface Props {
  user: User;
  complaints: Complaint[];
  communities: Community[];
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
  onCreateCommunity: (name: string) => void;
  onAddUser: (communityId: string, email: string) => void;
}

const AdminDashboard: React.FC<Props> = ({ 
  user, 
  complaints, 
  communities, 
  onUpdateStatus, 
  onCreateCommunity,
  onAddUser 
}) => {
  const [newCommName, setNewCommName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  
  const currentCommunity = communities.find(c => c.id === user.communityId);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-orbitron text-4xl font-black text-white">HASHIRA COMMAND</h1>
          <p className="text-yellow-500 uppercase font-bold text-sm tracking-tighter">
            Community: {currentCommunity ? currentCommunity.name : 'No Active Domain'}
          </p>
        </div>
      </header>

      {!user.communityId ? (
        <div className="glass-panel p-8 rounded-2xl thunder-border">
          <h2 className="font-orbitron text-xl font-black mb-4 uppercase">Initialize Your Domain</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={newCommName}
              onChange={(e) => setNewCommName(e.target.value)}
              className="flex-1 bg-black border border-yellow-500/30 p-3 rounded"
              placeholder="Enter Community Name (e.g., Tokyo Corps)"
            />
            <button 
              onClick={() => onCreateCommunity(newCommName)}
              className="thunder-gradient text-black px-6 font-black uppercase rounded"
            >
              Form Community
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Complaints Table */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-orbitron text-xl font-bold uppercase border-l-4 border-yellow-500 pl-4">Pending Missions</h2>
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-xl opacity-50">
                  <p className="uppercase tracking-widest font-black">All threats neutralized.</p>
                </div>
              ) : (
                complaints.map(complaint => (
                  <div key={complaint.id} className="glass-panel p-6 rounded-xl border border-yellow-500/10 hover:border-yellow-500/30 transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-40 h-40 bg-black/50 rounded-lg flex-shrink-0 relative">
                        {complaint.image ? (
                          <img src={complaint.image} className="w-full h-full object-cover rounded-lg" alt="Evidence" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <i className="fas fa-image text-3xl"></i>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-[8px] font-black text-white uppercase tracking-tighter">
                          ID: {complaint.id}
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-orbitron text-xl font-black text-yellow-400">{complaint.title}</h3>
                            <p className="text-xs text-gray-500 uppercase font-bold">Reported by: {complaint.userName}</p>
                          </div>
                          <select 
                            value={complaint.status}
                            onChange={(e) => onUpdateStatus(complaint.id, e.target.value as ComplaintStatus)}
                            className={`p-2 rounded text-xs font-black uppercase border-none focus:ring-2 focus:ring-yellow-400 ${
                              complaint.status === ComplaintStatus.PENDING ? 'bg-yellow-500 text-black' :
                              complaint.status === ComplaintStatus.IN_PROGRESS ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                            }`}
                          >
                            <option value={ComplaintStatus.PENDING}>Pending</option>
                            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                          </select>
                        </div>
                        
                        <p className="text-gray-400 text-sm">{complaint.description}</p>
                        
                        <div className="flex flex-wrap gap-4 pt-2 border-t border-yellow-500/10">
                          {complaint.location && (
                            <a 
                              href={`https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-yellow-500 hover:underline flex items-center gap-1"
                            >
                              <i className="fas fa-map-marker-alt"></i> View on Map
                            </a>
                          )}
                          <span className="text-xs text-gray-500"><i className="fas fa-calendar mr-1"></i> {new Date(complaint.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Admin Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl thunder-border">
              <h3 className="font-orbitron text-lg font-black text-white mb-4 uppercase">Manage Corps</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-yellow-500 uppercase mb-2">Invite Member (Email)</label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="email" 
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="bg-black/50 border border-yellow-500/20 p-2 rounded text-sm"
                      placeholder="tanjiro@corps.com"
                    />
                    <button 
                      onClick={() => {
                        onAddUser(user.communityId!, newUserEmail);
                        setNewUserEmail('');
                      }}
                      className="w-full py-2 bg-yellow-500 text-black font-black uppercase text-xs rounded hover:bg-yellow-400 transition-colors"
                    >
                      Add to Domain
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-yellow-500/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Active Members</h4>
                  <div className="space-y-2">
                    {currentCommunity?.memberIds.map((id, idx) => (
                      <div key={id} className="flex items-center gap-3 p-2 bg-yellow-500/5 rounded">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-xs">
                          {idx === 0 ? 'H' : 'M'}
                        </div>
                        <span className="text-xs font-bold text-gray-400">Member_{id.slice(-4)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
              <h3 className="font-orbitron text-lg font-black text-blue-400 mb-2 uppercase">System Health</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs uppercase font-black text-gray-400">Real-time Sync Active</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-2 italic">Monitoring all thunder strikes in your region.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
