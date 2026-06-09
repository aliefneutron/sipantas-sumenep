import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Megaphone, Trash2, Send, Loader2, BellRing, Save } from 'lucide-react';
import { NotificationMsg } from '../types';

export function NotificationManagement() {
  const [notifications, setNotifications] = useState<NotificationMsg[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('Admin Bappeda');
  const [isSending, setIsSending] = useState(false);

  const [runningText, setRunningText] = useState('Selamat datang di SIPANTAS. Harap lengkapi seluruh indikator sebelum batas waktu.');
  const [isSavingText, setIsSavingText] = useState(false);

  useEffect(() => {
    // 1. Listen to running text config
    const unsubConfig = onSnapshot(doc(db, 'system', 'config'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().runningText) {
        setRunningText(docSnap.data().runningText);
      }
    });

    // 2. Fetch Notifications
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubNotifs = onSnapshot(q, (snap) => {
      const data: NotificationMsg[] = [];
      snap.forEach(d => {
        data.push({ id: d.id, ...d.data() } as NotificationMsg);
      });
      setNotifications(data);
      setLoading(false);
    });

    return () => {
      unsubConfig();
      unsubNotifs();
    };
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !sender.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        sender: sender.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
      });
      setMessage('');
      alert('Pengumuman berhasil disiarkan!');
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim pengumuman.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus pengumuman ini?")) return;
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      alert('Gagal menghapus pengumuman.');
    }
  };

  const handleSaveRunningText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingText(true);
    try {
      const docRef = doc(db, 'system', 'config');
      await updateDoc(docRef, { runningText });
      alert('Teks berjalan berhasil diperbarui!');
    } catch (error: any) {
      // If document doesn't exist, we must create it. But we'll try update first.
      if (error.code === 'not-found') {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'system', 'config'), { runningText });
        alert('Teks berjalan berhasil diperbarui!');
      } else {
        alert('Gagal menyimpan teks berjalan.');
      }
    } finally {
      setIsSavingText(false);
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
    <div className="space-y-6 animate-fadeIn">
      
      {/* Running Text Config */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full p-6 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Teks Berjalan (Marquee)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Teks yang terus bergerak di bagian atas layar seluruh pengguna.</p>
          </div>
        </div>
        
        <form onSubmit={handleSaveRunningText} className="flex gap-3">
          <input 
            type="text"
            required
            value={runningText}
            onChange={(e) => setRunningText(e.target.value)}
            placeholder="Masukkan informasi terbaru..."
            className="flex-1 text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition font-medium"
          />
          <button 
            type="submit"
            disabled={isSavingText}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            {isSavingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Notification Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left h-fit sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Siaran Lonceng</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kirim pesan *pop-up* ke semua OPD.</p>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Nama Pengirim</label>
              <input 
                type="text" 
                required
                value={sender} 
                onChange={(e) => setSender(e.target.value)}
                className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] transition" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Isi Pengumuman</label>
              <textarea 
                required
                rows={4}
                placeholder="Tulis pesan pengumuman..."
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] transition resize-none" 
              />
            </div>
            <button 
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold transition shadow-md disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Siarkan Sekarang</>}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Riwayat Siaran Lonceng</h3>
          
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <BellRing className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Belum ada pengumuman yang disiarkan.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition bg-slate-50/50 flex gap-4 group">
                  <div className="p-2.5 bg-white shadow-sm rounded-full h-fit text-emerald-600 shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-slate-800 text-sm">{notif.sender}</h5>
                      <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                        {new Date(notif.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 h-fit transition opacity-0 group-hover:opacity-100"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
