
import React, { useState, useRef } from 'react';
import { User, Complaint, ComplaintStatus, Community } from '../types';

interface Props {
  user: User;
  complaints: Complaint[];
  communities: Community[];
  onAddComplaint: (complaint: Complaint) => void;
}

const Dashboard: React.FC<Props> = ({ user, complaints, communities, onAddComplaint }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number, address?: string } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setImage(dataUrl);
        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }
    }
  };

  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
        });
        setIsLocating(false);
      }, (error) => {
        console.error("Location error", error);
        setIsLocating(false);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.communityId) {
      alert("You must be part of a community to raise complaints!");
      return;
    }

    const newComplaint: Complaint = {
      id: `C-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      title,
      description,
      image: image || undefined,
      location: location || undefined,
      status: ComplaintStatus.PENDING,
      timestamp: Date.now(),
      communityId: user.communityId
    };

    onAddComplaint(newComplaint);
    setIsReporting(false);
    setTitle('');
    setDescription('');
    setImage(null);
    setLocation(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-orbitron text-4xl font-black text-white">CORPS DASHBOARD</h1>
          <p className="text-gray-400">Total Missions: {complaints.length}</p>
        </div>
        <button 
          onClick={() => setIsReporting(true)}
          className="thunder-gradient text-black px-8 py-3 rounded-full font-black uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-yellow-500/20"
        >
          <i className="fas fa-plus-circle"></i> New Complaint
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending', count: complaints.filter(c => c.status === ComplaintStatus.PENDING).length, icon: 'clock', color: 'text-yellow-500' },
          { label: 'In Progress', count: complaints.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length, icon: 'bolt', color: 'text-blue-400' },
          { label: 'Resolved', count: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length, icon: 'check-circle', color: 'text-green-500' },
        ].map(stat => (
          <div key={stat.label} className="glass-panel p-6 rounded-xl thunder-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 uppercase text-xs font-bold">{stat.label}</p>
                <h3 className={`text-3xl font-orbitron font-black ${stat.color}`}>{stat.count}</h3>
              </div>
              <i className={`fas fa-${stat.icon} text-3xl opacity-20`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Modal/Form */}
      {isReporting && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden thunder-border max-h-[90vh] overflow-y-auto">
            <div className="bg-yellow-500 p-4 text-black flex justify-between items-center">
              <h3 className="font-orbitron font-black text-xl uppercase">Raise Issue</h3>
              <button onClick={() => setIsReporting(false)} className="text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-yellow-500 uppercase mb-2">Subject</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/50 border border-yellow-500/20 p-3 rounded focus:border-yellow-500 outline-none" 
                  placeholder="e.g. Broken water pipe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-500 uppercase mb-2">Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/50 border border-yellow-500/20 p-3 rounded focus:border-yellow-500 outline-none"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-yellow-500 uppercase mb-1">Visual Proof</label>
                  {!isCapturing && !image && (
                    <button 
                      type="button" 
                      onClick={startCamera}
                      className="w-full p-8 border-2 border-dashed border-yellow-500/30 rounded-xl hover:bg-yellow-500/10 transition-colors flex flex-col items-center gap-2"
                    >
                      <i className="fas fa-camera text-3xl"></i>
                      <span className="text-xs uppercase font-bold">Launch Camera</span>
                    </button>
                  )}
                  {isCapturing && (
                    <div className="relative rounded-xl overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover bg-black" />
                      <button 
                        type="button" 
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black p-4 rounded-full shadow-lg"
                      >
                        <i className="fas fa-camera"></i>
                      </button>
                    </div>
                  )}
                  {image && (
                    <div className="relative group rounded-xl overflow-hidden">
                      <img src={image} alt="Captured" className="w-full h-48 object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-yellow-500 uppercase mb-1">GPS Location</label>
                  {!location ? (
                    <button 
                      type="button" 
                      onClick={detectLocation}
                      disabled={isLocating}
                      className="w-full p-8 border-2 border-dashed border-yellow-500/30 rounded-xl hover:bg-yellow-500/10 transition-colors flex flex-col items-center gap-2"
                    >
                      <i className={`fas fa-location-crosshairs text-3xl ${isLocating ? 'animate-spin' : ''}`}></i>
                      <span className="text-xs uppercase font-bold">{isLocating ? 'Locating...' : 'Auto-Locate'}</span>
                    </button>
                  ) : (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <p className="text-yellow-500 font-bold mb-1"><i className="fas fa-map-marker-alt mr-2"></i>Location Found</p>
                      <p className="text-xs text-gray-400 truncate">{location.address}</p>
                      <button onClick={() => setLocation(null)} className="text-xs text-red-400 mt-2 hover:underline">Reset Location</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-yellow-500/20">
                <button 
                  type="submit"
                  className="w-full thunder-gradient text-black font-black py-4 rounded-xl uppercase tracking-tighter"
                >
                  <i className="fas fa-paper-plane mr-2"></i> Deploy Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint List */}
      <div className="space-y-4">
        <h2 className="font-orbitron text-xl font-bold uppercase tracking-widest border-l-4 border-yellow-500 pl-4">Your Recent Submissions</h2>
        {complaints.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-xl border-dashed border-2 border-yellow-500/20">
            <p className="text-gray-500 uppercase tracking-widest font-bold">The skies are clear. No active complaints.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {complaints.map(complaint => (
              <div key={complaint.id} className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-6 hover:border-yellow-500/50 transition-all border-l-4 border-l-yellow-500">
                {complaint.image ? (
                  <img src={complaint.image} className="w-full md:w-32 h-32 object-cover rounded-lg" alt="Issue" />
                ) : (
                  <div className="w-full md:w-32 h-32 bg-black/40 rounded-lg flex items-center justify-center text-yellow-500/20">
                    <i className="fas fa-image text-4xl"></i>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-orbitron text-lg font-black text-white">{complaint.title}</h4>
                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase ${
                      complaint.status === ComplaintStatus.PENDING ? 'bg-yellow-500 text-black' :
                      complaint.status === ComplaintStatus.IN_PROGRESS ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span><i className="fas fa-clock mr-1"></i> {new Date(complaint.timestamp).toLocaleString()}</span>
                    {complaint.location && (
                      <span className="text-yellow-500/70"><i className="fas fa-location-dot mr-1"></i> Located</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
