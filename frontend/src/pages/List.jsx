import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function List() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLists = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/list`);
      setLists(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchLists(); }, [fetchLists]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/logout`);
      navigate('/');
    } catch (err) { console.error(err); }
  };

  const handleAdd = async () => {
    const { value: title } = await Swal.fire({
      title: 'New List Name',
      input: 'text',
      confirmButtonColor: '#10b981',
      background: '#09090b',
      color: '#fff',
      customClass: { input: 'bg-zinc-900 border-zinc-700 text-white' }
    });
    if (title) {
      await axios.post(`${API}/api/list`, { title });
      fetchLists();
    }
  };

  const handleEdit = async (e, id, currentTitle) => {
    e.stopPropagation(); // Pigilan ang pag-navigate sa details
    const { value: newTitle } = await Swal.fire({
      title: 'Update List Name',
      input: 'text',
      inputValue: currentTitle,
      confirmButtonColor: '#10b981',
      background: '#09090b',
      color: '#fff',
    });
    if (newTitle && newTitle !== currentTitle) {
      await axios.put(`${API}/api/list/${id}`, { title: newTitle });
      fetchLists();
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete List?',
      text: "All tasks inside will be purged.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#09090b',
      color: '#fff'
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/list/${id}`);
      fetchLists();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-zinc-300">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto w-full p-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Command Center</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Active Directories</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
              + New List
            </button>
            <button onClick={handleLogout} className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-zinc-600 animate-pulse uppercase text-[10px] font-bold">Accessing Database...</p>
          ) : lists.map(l => (
            <div 
              key={l.list_id} 
              onClick={() => navigate(`/details/${l.list_id}`, { state: { title: l.title } })}
              className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] hover:border-emerald-500/50 cursor-pointer transition-all group relative"
            >
              <h3 className="text-2xl font-black text-white mb-4 italic uppercase truncate">{l.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-zinc-600 font-mono tracking-widest">REF: {l.list_id}</span>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={(e) => handleEdit(e, l.list_id, l.title)} className="text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:text-white">Edit</button>
                  <button onClick={(e) => handleDelete(e, l.list_id)} className="text-red-500 text-[9px] font-black uppercase tracking-widest hover:text-white">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default List;