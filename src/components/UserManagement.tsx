import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { UserPlus, Edit2, Trash2, Users, Shield, Loader2, Save, X } from 'lucide-react';
import { UserSession } from './Login';

interface UserData {
  id: string;
  username: string;
  password?: string; // We keep it simple for prototype, store in clear or hashed. Here cleartext since it's prototype.
  name: string;
  role: 'admin' | 'opd' | 'superadmin';
}

interface UserManagementProps {
  onResetDatabase?: () => void;
}

export function UserManagement({ onResetDatabase }: UserManagementProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({
    username: '',
    password: '',
    name: '',
    role: 'opd'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const snap = await getDocs(usersRef);
      const data: UserData[] = [];
      snap.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as UserData);
      });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ username: '', password: '', name: '', role: 'opd' });
    setIsModalOpen(true);
  };

  const openEdit = (user: UserData) => {
    setEditingId(user.id);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus akun ${name}?`)) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      alert('Akun berhasil dihapus');
      fetchUsers();
    } catch (error) {
      alert('Gagal menghapus akun');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.name || !formData.role) {
      alert('Mohon isi semua field!');
      return;
    }

    try {
      if (editingId) {
        // Edit existing
        const userRef = doc(db, 'users', editingId);
        await updateDoc(userRef, {
          username: formData.username,
          password: formData.password,
          name: formData.name,
          role: formData.role
        });
        alert('Akun berhasil diperbarui!');
      } else {
        // Add new
        await addDoc(collection(db, 'users'), {
          username: formData.username,
          password: formData.password,
          name: formData.name,
          role: formData.role
        });
        alert('Akun baru berhasil dibuat!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#166534]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full p-6 space-y-6 text-left animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded uppercase tracking-wider font-mono">
            Menu Super Admin
          </span>
          <h3 className="text-xl font-bold text-[#166534] mt-2">
            Pengaturan Sistem & Akun
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tambah, edit, hapus akun pengguna dan kelola pengaturan tingkat tinggi.
          </p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16A34A] text-white hover:bg-[#15803D] rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Tambah Akun Baru
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4">Nama Akun / Instansi</th>
              <th className="p-4">Username</th>
              <th className="p-4">Password</th>
              <th className="p-4">Role Akses</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="w-10 h-10 mb-2 opacity-20" />
                    Belum ada data akun di database.
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                  <td className="p-4 font-semibold text-slate-700">{user.name}</td>
                  <td className="p-4 font-mono text-slate-500">{user.username}</td>
                  <td className="p-4 text-slate-400 font-mono text-xs">
                    {/* Hide password partially for display */}
                    •••••••
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                      user.role === 'admin' || user.role === 'superadmin' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit Akun">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id, user.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Hapus Akun">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Danger Zone */}
      {onResetDatabase && (
        <div className="mt-12 pt-6 border-t border-red-100 animate-fadeIn">
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-red-700 font-bold text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Zona Berbahaya (Danger Zone)
              </h4>
              <p className="text-xs text-red-600/80 mt-1 font-medium leading-relaxed max-w-lg">
                Tindakan ini akan <b>menghapus seluruh draf capaian dan bukti file</b> dari seluruh tatanan yang sudah diisi, serta mengembalikan aplikasi ke kondisi kosong dari pabrik. <b>Hanya lakukan jika Anda sedang dalam tahap uji coba (Testing).</b>
              </p>
            </div>
            <button 
              onClick={onResetDatabase}
              className="w-full md:w-auto px-5 py-3 bg-white text-red-600 hover:bg-red-600 hover:text-white font-bold text-sm rounded-xl border-2 border-red-200 hover:border-red-600 transition-all shadow-sm"
            >
              Reset Total Database
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-scaleUp overflow-hidden">
            <div className="bg-[#166534] p-5 text-white flex justify-between items-center">
              <h4 className="font-bold flex items-center gap-2">
                <Shield className="w-5 h-5" /> {editingId ? 'Edit Akun Pengguna' : 'Tambah Akun Baru'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full cursor-pointer transition">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Nama Instansi / Profil</label>
                <input 
                  type="text" 
                  required
                  placeholder="Misal: Dinas Kesehatan"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Role Akses</label>
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition cursor-pointer"
                >
                  <option value="opd">OPD Pengampu (Akses Terbatas)</option>
                  <option value="admin">Admin (Akses Penuh)</option>
                  <option value="superadmin">Super Admin (Akses Sistem)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Username Login</label>
                <input 
                  type="text" 
                  required
                  placeholder="Misal: dinkes_sumenep"
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Password Login</label>
                <input 
                  type="text" 
                  required
                  placeholder="Masukkan password"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg"
                >
                  <Save className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
