import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  
  const API = 'http://localhost:3000'; 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isSignup ? `${API}/register` : `${API}/login`;
      const res = await axios.post(url, { username, password });

      if (res.data.success) {
        if (!isSignup) {
          navigate('/list');
        } else {
          Swal.fire({ icon: 'success', title: 'System Initialized', text: 'You can now login.', background: '#09090b', color: '#fff' });
          setIsSignup(false);
          setUsername('');
          setPassword('');
        }
      }
    } catch (err) {
      // Dito natin makikita kung ano ang error message mula sa backend
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Connection Fault";
      Swal.fire({ icon: 'error', title: 'Access Denied', text: errMsg, background: '#09090b', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4 font-sans text-zinc-300">
      <div className="bg-zinc-900/40 w-full max-w-md p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase">
            {isSignup ? 'Register' : 'Login'}
          </h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">ToDoList Application</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-700" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-zinc-700" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <button 
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all transform active:scale-95 shadow-lg shadow-emerald-500/10" 
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignup ? 'Confirm Registration' : 'Login to Dashboard'}
          </button>
        </form>
        
        <p 
          className="text-center mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-emerald-500 transition-colors" 
          onClick={() => { setIsSignup(!isSignup); setUsername(''); setPassword(''); }}
        >
          {isSignup ? 'Existing Member? Login' : "No Account? Register Here"}
        </p>
      </div>
    </div>
  );
}

export default App;