import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'https://to-do-list-bthl.onrender.com';
axios.defaults.withCredentials = true;

function Details() {
  const { id } = useParams(); 
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/items/${id}`);
      setItems(res.data);
    } catch (err) { 
      if (err.response?.status === 401) navigate('/');
    } finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    const { value: desc } = await Swal.fire({
      title: 'New Task Entry',
      input: 'text',
      inputPlaceholder: 'Task description...',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      background: '#09090b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-zinc-800', input: 'bg-zinc-950 border-zinc-800 text-white' }
    });
    
    if (desc) {
      try {
        await axios.post(`${API}/api/items`, { list_id: id, description: desc });
        fetchItems();
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  const handleEditTask = async (itemId, currentDesc) => {
    const { value: newDesc } = await Swal.fire({
      title: 'Update Protocol',
      input: 'text',
      inputValue: currentDesc,
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      background: '#09090b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-zinc-800', input: 'bg-zinc-950 border-zinc-800 text-white' }
    });

    if (newDesc && newDesc !== currentDesc) {
      try {
        await axios.put(`${API}/api/items/${itemId}`, { description: newDesc });
        fetchItems();
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  const toggleStatus = async (itemId, currentStatus) => {
    try {
      await axios.put(`${API}/api/items/${itemId}`, { is_completed: !currentStatus });
      fetchItems();
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    }
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: 'Terminate Task?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#09090b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-zinc-800' }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/api/items/${itemId}`);
        fetchItems();
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-zinc-300 font-sans">
      <Header />
      <main className="flex-grow p-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/list')} className="mb-10 flex items-center gap-2 text-zinc-500 hover:text-emerald-400 font-black transition-all text-[10px] uppercase tracking-[0.2em]">
            ← Back to Directory
          </button>

          <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-800 pb-10">
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                {state?.title || 'Active List'}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                  {items.filter(i => !i.is_completed).length} Pending Protocols
                </span>
              </div>
            </div>
            <button onClick={handleAdd} className="bg-zinc-100 text-black px-8 py-3 rounded-full font-black hover:bg-emerald-500 transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10">
              + New Task
            </button>
          </header>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-20 text-zinc-600 font-mono text-xs animate-pulse tracking-[0.3em]">READING DATABASE...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest italic">No data found in this directory.</p>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.item_id} 
                  className={`p-6 rounded-3xl border flex items-center justify-between group transition-all duration-300 ${
                    item.is_completed ? 'bg-zinc-950/30 border-transparent opacity-50' : 'bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-5 flex-1">
                    <input 
                      type="checkbox" 
                      checked={item.is_completed} 
                      onChange={() => toggleStatus(item.item_id, item.is_completed)} 
                      className="w-5 h-5 rounded-md border-zinc-700 bg-transparent text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer"
                    />
                    <span className={`text-lg font-bold tracking-tight transition-all ${
                      item.is_completed ? 'line-through text-zinc-600' : 'text-zinc-100'
                    }`}>
                      {item.description}
                    </span>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleEditTask(item.item_id, item.description)} className="text-[10px] font-black uppercase text-zinc-500 hover:text-emerald-500 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.item_id)} className="text-[10px] font-black uppercase text-zinc-500 hover:text-red-500 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Details;