
import React from 'react';
import { User, UserRole } from '../types';

interface Props {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ user, onLogout }) => {
  return (
    <nav className="glass-panel border-b border-yellow-500/30 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center thunder-glow">
            <i className="fas fa-bolt text-black text-xl"></i>
          </div>
          <span className="font-orbitron text-2xl font-black tracking-widest lightning-text">
            ZENITSU <span className="text-white">OS</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:block text-right">
            <p className="text-sm text-yellow-500 font-bold uppercase tracking-tighter">
              {user.role === UserRole.ADMIN ? 'First Form: Admin' : 'Hekireki Issen'}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 border border-yellow-500/50 hover:bg-yellow-500 hover:text-black transition-all rounded font-bold uppercase text-xs"
          >
            Sleep / Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
