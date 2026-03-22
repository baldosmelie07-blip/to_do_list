import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API = 'https://to-do-list-bthl.onrender.com';

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation check bago mag-send sa database
    if (password !== confirm) {
      return Swal.fire({
        icon: 'error',
        title: 'Sync Error',
        text: 'Passwords do not match!',
        background: '#09090b',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/register`, { username, password });
      
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'System Access Granted',
          text: 'Account has been initialized.',
          background: '#09090b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
        navigate('/'); // Balik sa Login page
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'Username might already exist in the database.',
        background: '#09090b',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4 font-sans">
      <div className="bg-zinc-900/30 w-full max-w-md p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            New Directory
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Sign Up</h1>
          <p className="text-zinc-500 text-xs mt-2 italic">Register your credentials to the TaskFlow core.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2 tracking-widest">Username</label>
            <input 
              className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-700" 
              placeholder="Unique identifier" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2 tracking-widest">Password</label>
            <input 
              className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-700" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2 tracking-widest">Confirm Access</label>
            <input 
              className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-700" 
              type="password" 
              placeholder="••••••••" 
              value={confirm} 
              onChange={(e) => setConfirm(e.target.value)} 
              required 
            />
          </div>

          <button 
            className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? 'Processing Data...' : 'Confirm Registration'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/')} 
          className="w-full mt-6 text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors"
        >
          ← Back to Terminal
        </button>
      </div>
    </div>
  );
}

export default Register;