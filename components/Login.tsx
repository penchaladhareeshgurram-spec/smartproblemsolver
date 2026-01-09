
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? email.split('@')[0] : name,
      email,
      role
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="glass-panel p-8 rounded-2xl thunder-border thunder-glow">
        <div className="text-center mb-8">
          <i className="fas fa-cloud-bolt text-5xl text-yellow-400 mb-4"></i>
          <h2 className="font-orbitron text-3xl font-black text-white uppercase tracking-widest">
            {isLogin ? 'Awaken' : 'Join the Corps'}
          </h2>
          <p className="text-gray-400">Thunder Breathing, First Form: Sixfold</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-yellow-500 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-yellow-500/30 p-3 rounded text-white focus:outline-none focus:border-yellow-400"
                placeholder="Agatsuma Zenitsu"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-yellow-500 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-yellow-500/30 p-3 rounded text-white focus:outline-none focus:border-yellow-400"
              placeholder="thunder@corps.com"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex-1 flex flex-col cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                className="hidden peer" 
                checked={role === UserRole.USER}
                onChange={() => setRole(UserRole.USER)}
              />
              <div className="p-3 text-center border border-yellow-500/30 rounded peer-checked:bg-yellow-500 peer-checked:text-black transition-all uppercase font-bold text-xs">
                Corps Member
              </div>
            </label>
            <label className="flex-1 flex flex-col cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                className="hidden peer"
                checked={role === UserRole.ADMIN}
                onChange={() => setRole(UserRole.ADMIN)}
              />
              <div className="p-3 text-center border border-yellow-500/30 rounded peer-checked:bg-yellow-500 peer-checked:text-black transition-all uppercase font-bold text-xs">
                Hashira (Admin)
              </div>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full thunder-gradient text-black font-black py-4 rounded-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isLogin ? 'Enter System' : 'Register Now'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-400 font-bold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
