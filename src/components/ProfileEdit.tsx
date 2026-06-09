import React, { useState } from 'react';
import { db, storage } from '../lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera, X, Save, Loader2 } from 'lucide-react';
import { UserSession } from './Login';

interface ProfileEditProps {
  userSession: UserSession;
  onClose: () => void;
  onUpdateSession: (updatedSession: UserSession) => void;
}

export function ProfileEdit({ userSession, onClose, onUpdateSession }: ProfileEditProps) {
  const [name, setName] = useState(userSession.name);
  const [password, setPassword] = useState(''); // Empty means don't change
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(userSession.avatarUrl || null);
  const [loading, setLoading] = useState(false);

  // If bypass, we can't edit in db
  const isBypass = userSession.id === 'superadmin-bypass';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB.");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBypass) {
      alert("Akun darurat (bypass) tidak dapat mengubah profil di database.");
      return;
    }

    setLoading(true);
    try {
      let finalAvatarUrl = userSession.avatarUrl;

      // 1. Upload new avatar if selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const storageRef = ref(storage, `avatars/${userSession.id}_${Date.now()}.${fileExt}`);
        const snapshot = await uploadBytes(storageRef, file);
        finalAvatarUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Update Firestore
      const userRef = doc(db, 'users', userSession.id);
      const updates: any = {
        name: name,
        ...(finalAvatarUrl ? { avatarUrl: finalAvatarUrl } : {})
      };
      
      // Fetch existing user to preserve password if not changing
      if (password.trim() !== '') {
        updates.password = password;
      }

      await updateDoc(userRef, updates);

      // 3. Update Local Session
      const newSession: UserSession = {
        ...userSession,
        name: name,
        avatarUrl: finalAvatarUrl
      };
      onUpdateSession(newSession);

      alert("Profil berhasil diperbarui!");
      onClose();

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-scaleUp overflow-hidden">
        <div className="bg-[#166534] p-5 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <h4 className="font-bold flex items-center gap-2 relative z-10">
            Edit Profil Akun
          </h4>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full cursor-pointer transition relative z-10">
            <X className="w-5 h-5"/>
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Avatar Upload Area */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center text-3xl font-bold uppercase">
                    {name.charAt(0)}
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Ganti Foto"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider font-semibold">Klik gambar untuk mengganti</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nama Tampilan</label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition font-medium text-slate-700" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ganti Password <span className="text-slate-400 normal-case font-normal">(Opsional)</span></label>
              <input 
                type="text" 
                placeholder="Kosongkan jika tidak ingin ganti"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading || isBypass}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Simpan Profil</>}
            </button>
            {isBypass && (
               <p className="text-xs text-red-500 mt-2 text-center font-medium">Bypass akun tidak dapat diedit.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
