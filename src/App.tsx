import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, Settings, Users, BookOpen, AlertTriangle, 
  Bell, Clock, Calendar, RefreshCw, FileText, Sparkles, Building, Lock, Info, CheckCircle,
  Menu, ChevronDown, ChevronRight, Database,
  User, LayoutGrid, ShoppingBag, Briefcase, MapPin, Truck, Shield, Globe, Edit2, Megaphone, LogOut, Loader2
} from 'lucide-react';
import { KabupatenProposal, SystemConfig, NotificationMsg, INITIAL_TATANAN_STRUCTURE } from './types';
import { INITIAL_PROPOSALS, INITIAL_SYSTEM_CONFIG, NOTIFICATIONS_MOCK, createEmptyProposal } from './data';
import { KabupatenDashboard } from './components/KabupatenDashboard';
import { RekapitulasiData } from './components/RekapitulasiData';
import { Login, UserSession } from './components/Login';
import { UserManagement } from './components/UserManagement';
import { ProfileEdit } from './components/ProfileEdit';
import { NotificationManagement } from './components/NotificationManagement';
import { collection, onSnapshot, doc, setDoc, query, orderBy } from "firebase/firestore";
import { db } from "./lib/firebase";

export default function App() {
  // App state persistent storage
  const [proposals, setProposals] = useState<KabupatenProposal[]>(INITIAL_PROPOSALS);
  const [resetKey, setResetKey] = useState(0);

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const stored = localStorage.getItem('sipantas_config_v1');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return INITIAL_SYSTEM_CONFIG; }
    }
    return INITIAL_SYSTEM_CONFIG;
  });

  const [notifications, setNotifications] = useState<NotificationMsg[]>([]);
  const [runningText, setRunningText] = useState('Selamat datang di SIPANTAS. Harap lengkapi seluruh indikator sebelum batas waktu.');

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [isTatananMenuOpen, setIsTatananMenuOpen] = useState(true);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isYearTransitioning, setIsYearTransitioning] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('sipantas_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (user: UserSession) => {
    setUserSession(user);
    localStorage.setItem('sipantas_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUserSession(null);
    localStorage.removeItem('sipantas_session');
    setActiveMenu('dashboard');
  };

  // Sync state to local storage when resetKey changes (for full reset)
  useEffect(() => {
    if (resetKey > 0) {
      setSystemConfig(INITIAL_SYSTEM_CONFIG);
      localStorage.setItem('sipantas_config_v1', JSON.stringify(INITIAL_SYSTEM_CONFIG));
      
      // Also reset Firestore
      INITIAL_PROPOSALS.forEach(async (p) => {
        try { await setDoc(doc(db, "proposals", p.id), p); } catch(e) {}
      });
    }
  }, [resetKey]);

  // Listen to Firestore real-time updates for proposals
  useEffect(() => {
    // Start listener if logged in
    if (!userSession) return;

    const unsubscribe = onSnapshot(collection(db, "proposals"), (snapshot) => {
      if (snapshot.empty) {
        // Seed database if empty
        INITIAL_PROPOSALS.forEach(async (p) => {
          try {
            await setDoc(doc(db, "proposals", p.id), p);
          } catch (error) {
            console.error("Error seeding initial proposals:", error);
          }
        });
      } else {
        const loaded: KabupatenProposal[] = [];
        snapshot.forEach((docSnapshot) => {
          loaded.push(docSnapshot.data() as KabupatenProposal);
        });
        setProposals(loaded);
      }
    });

    return () => unsubscribe();
  }, [userSession]);

  // Listen to Firestore real-time updates for the current user's profile
  useEffect(() => {
    if (!userSession?.id) return;
    
    const unsubscribe = onSnapshot(doc(db, 'users', userSession.id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserSession(prev => {
          if (!prev) return prev;
          const newSession = {
            ...prev,
            username: data.username,
            name: data.name,
            role: data.role,
            avatarUrl: data.avatarUrl
          };
          
          if (JSON.stringify(prev) !== JSON.stringify(newSession)) {
            localStorage.setItem('sipantas_session', JSON.stringify(newSession));
            return newSession;
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, [userSession?.id]);

  // Listen to Firestore real-time updates for Notifications and Running Text
  useEffect(() => {
    if (!userSession) return;

    // Running text
    const unsubConfig = onSnapshot(doc(db, 'system', 'config'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().runningText) {
        setRunningText(docSnap.data().runningText);
      }
    });

    // Notifications
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubNotifs = onSnapshot(q, (snap) => {
      const data: NotificationMsg[] = [];
      snap.forEach(d => {
        data.push({ id: d.id, ...d.data() } as NotificationMsg);
      });
      setNotifications(data);
    });

    return () => {
      unsubConfig();
      unsubNotifs();
    };
  }, [userSession]);

  // Persist alterations
  const updateSingleProposal = async (updated: KabupatenProposal) => {
    // Update local state optimistically
    let updatedList = [...proposals];
    const existingIndex = updatedList.findIndex(p => p.id === updated.id);
    if (existingIndex >= 0) {
      updatedList[existingIndex] = updated;
    } else {
      updatedList.push(updated);
    }
    setProposals(updatedList);
    
    // Save to Firestore
    try {
      await setDoc(doc(db, "proposals", updated.id), updated);
    } catch (error) {
      console.error("Error saving proposal to Firestore:", error);
      triggerNotification("System Error", "Gagal menyimpan data ke cloud Firebase.");
    }
  };

  const updateSystemConfig = (newConfig: SystemConfig) => {
    setSystemConfig(newConfig);
    localStorage.setItem('sipantas_config_v1', JSON.stringify(newConfig));
  };

  // Trigger app notifications
  const triggerNotification = (sender: string, message: string) => {
    const newNotif: NotificationMsg = {
      id: `dynamic-n-${Date.now()}`,
      sender,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('sipantas_notifs_v1', JSON.stringify(updatedNotifs));
  };

  const markAllNotifsRead = () => {
    const readList = notifications.map(n => ({ ...n, read: true }));
    setNotifications(readList);
    localStorage.setItem('sipantas_notifs_v1', JSON.stringify(readList));
  };

  // Full reset to play again
  const handleFullReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang data draf SIPANTAS Kabupaten ke pengaturan bawaan? Semua inputan Anda akan diset ulang.")) {
      localStorage.removeItem('sipantas_proposals_v1');
      localStorage.removeItem('sipantas_config_v1');
      localStorage.removeItem('sipantas_notifs_v1');
      setResetKey(prev => prev + 1);
    }
  };

  const currentYear = systemConfig.assessmentYear || 2026;
  let userProposal = proposals.find(p => p.kabupatenId === 'kab-sumenep' && p.assessmentYear === currentYear);
  
  // Backward compatibility: Recover old data stored under 'kab-sumenep' without assessmentYear
  if (!userProposal && currentYear === 2026) {
    const legacyProposal = proposals.find(p => p.id === 'kab-sumenep');
    if (legacyProposal) {
      userProposal = {
        ...legacyProposal,
        id: 'kab-sumenep-2026',
        kabupatenId: 'kab-sumenep',
        assessmentYear: 2026
      };
    }
  }

  // If no proposal exists for this year, generate a blank one
  if (!userProposal) {
    userProposal = createEmptyProposal('kab-sumenep', currentYear);
  }

  const appContent = (
    <div className="min-h-screen bg-[#F0FDF4] text-[#166534] flex flex-col md:flex-row" id="sipantas-app-root">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#BBF7D0] flex flex-col h-screen sticky top-0 shrink-0 z-50">
        <div className="p-4 border-b border-[#BBF7D0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[#166534] leading-none tracking-tighter text-lg">SIPANTAS</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="md:hidden p-1 text-slate-400 cursor-pointer hover:bg-slate-100 rounded">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-5 flex flex-col items-center justify-center border-b border-[#BBF7D0] text-center">
          <div 
            className="relative group cursor-pointer w-16 h-16 rounded-full mb-3 overflow-hidden border-2 border-white shadow-sm bg-slate-200"
            onClick={() => setIsProfileEditOpen(true)}
            title="Edit Profil"
          >
            {userSession?.avatarUrl ? (
              <img src={userSession.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center text-2xl font-bold uppercase">
                {userSession?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <button 
            onClick={() => setIsProfileEditOpen(true)}
            className="text-[11px] uppercase font-bold text-[#166534] hover:text-[#16A34A] flex items-center gap-1.5 transition cursor-pointer"
          >
            {userSession?.name || 'Loading...'} <Edit2 className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-slate-500 mt-1">( {userSession?.role === 'superadmin' ? 'Super Admin' : userSession?.role === 'admin' ? 'Admin' : 'OPD Pengampu'} )</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-widest">MENU</div>
          
          <button 
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeMenu === 'dashboard' ? 'bg-[#15803D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Settings className="w-4 h-4" /> Dashboard
          </button>
          
          <button 
            disabled
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition cursor-not-allowed opacity-50 text-slate-600`}
            title="Menu ini sedang dinonaktifkan"
          >
            <CheckCircle className="w-4 h-4" /> Open Defecation Free
          </button>

          {/* Kelembagaan */}
          <button 
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition text-slate-600 hover:bg-slate-100 cursor-pointer`}
          >
            <div className="flex items-center gap-3"><Building className="w-4 h-4" /> Kelembagaan</div>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Tatanan Accordion */}
          <div>
            <button 
              onClick={() => setIsTatananMenuOpen(!isTatananMenuOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeMenu.startsWith('tatanan-') ? 'bg-[#F0FDF4] text-[#166534]' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3"><FileText className="w-4 h-4" /> Tatanan</div>
              {isTatananMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isTatananMenuOpen && (
              <div className="mt-1 ml-4 border-l-2 border-slate-100 pl-2 space-y-1">
                {(userProposal?.tatanan || []).map((t, idx) => {
                  const TatananIcons = [User, LayoutGrid, BookOpen, ShoppingBag, Briefcase, MapPin, Truck, Shield, Globe];
                  const Icon = TatananIcons[idx] || Award;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveMenu(`tatanan-${t.id}`)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-[11px] font-medium transition cursor-pointer ${activeMenu === `tatanan-${t.id}` ? 'bg-[#15803D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${activeMenu === `tatanan-${t.id}` ? 'opacity-100' : 'opacity-60'}`} /> 
                      <span>{t.name.replace('Tatanan ', '')}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            disabled
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition cursor-not-allowed opacity-50 text-slate-600`}
            title="Menu ini sedang dinonaktifkan"
          >
            <Award className="w-4 h-4" /> Penghargaan
          </button>

          {(userSession?.role === 'admin' || userSession?.role === 'superadmin') && (
            <>
              <button 
                onClick={() => setActiveMenu('notifikasi')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeMenu === 'notifikasi' ? 'bg-[#15803D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Megaphone className="w-4 h-4" /> Kelola Pengumuman
              </button>

              <button 
                onClick={() => setActiveMenu('rekapitulasi')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeMenu === 'rekapitulasi' ? 'bg-[#15803D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Database className="w-4 h-4" /> Rekapitulasi & Backup
              </button>
            </>
          )}

          {userSession?.role === 'superadmin' && (
            <button 
              onClick={() => setActiveMenu('user-opd')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeMenu === 'user-opd' ? 'bg-[#15803D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Settings className="w-4 h-4" /> Pengaturan Sistem
            </button>
          )}

        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="bg-[#166534] text-white h-14 flex items-center justify-between px-4 shrink-0 shadow-sm z-40">
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm tracking-widest uppercase hidden md:block">PORTAL {userSession?.role.toUpperCase()}</span>
            {/* Year Dropdown */}
            <select 
              className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 text-xs outline-none cursor-pointer hover:bg-white/20 transition hidden sm:block disabled:opacity-50"
              value={systemConfig.assessmentYear || 2026}
              disabled={isYearTransitioning}
              onChange={(e) => {
                const newYear = parseInt(e.target.value);
                setIsYearTransitioning(true);
                setTimeout(() => {
                  updateSystemConfig({...systemConfig, assessmentYear: newYear});
                  setTimeout(() => setIsYearTransitioning(false), 600); // Smooth professional transition
                }, 50);
              }}
            >
              {Array.from({ length: 6 }, (_, i) => 2025 + i).map(y => (
                <option key={y} value={y} className="text-slate-800">Tahun Penilaian {y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-[10px] font-medium opacity-80 uppercase tracking-wider text-white">
              Created By Alief Neutron 2026
            </div>
            <div className="flex items-center gap-3 border-l border-white/20 pl-4 relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative hover:bg-white/10 p-1.5 rounded-full transition cursor-pointer">
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full animate-ping" />
                )}
              </button>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-7 h-7 rounded-full bg-white/20 overflow-hidden border border-white/30 flex items-center justify-center shrink-0 cursor-pointer hover:border-white transition"
              >
                {userSession?.avatarUrl ? (
                  <img src={userSession.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold uppercase text-white">{userSession?.name?.charAt(0) || 'U'}</span>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute top-10 right-0 mt-2 w-48 bg-white border border-[#BBF7D0] shadow-xl rounded-2xl p-2 z-50 text-left border-t-2 border-t-[#16A34A] animate-scaleUp text-[#166534]">
                  <div className="px-3 py-2 border-b border-[#F0FDF4] mb-2">
                    <p className="text-xs font-bold text-slate-800 truncate">{userSession?.name}</p>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5 tracking-wider">{userSession?.role}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer bg-red-50 text-red-600 hover:bg-red-100"
                  >
                     <LogOut className="w-3.5 h-3.5" /> Keluar (Logout)
                  </button>
                </div>
              )}

              {/* Notification Overlay Panel */}
              {showNotifications && (
                <div className="absolute top-10 right-0 mt-2 w-80 bg-white border border-[#BBF7D0] shadow-xl rounded-2xl p-4 z-50 text-left border-t-2 border-t-[#16A34A] animate-scaleUp text-[#166534]">
                  <div className="flex items-center justify-between border-b border-[#BBF7D0] pb-2 mb-2">
                    <span className="text-xs font-bold text-[#166534] font-display uppercase tracking-wide">Pemberitahuan Daerah</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="space-y-3.5 max-h-60 overflow-y-auto w-full">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">Tidak ada pemberitahuan baru.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="border-b border-[#F0FDF4] pb-2 last:border-0">
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#16A34A]">
                            <span>{n.sender}</span>
                            <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto bg-[#F0FDF4] p-4 md:p-6 lg:p-8 relative">
          
          <div className="w-full space-y-6">
            {/* Dynamic Announcement Banner (Marquee) */}
            <div className="bg-[#166534] text-[#F0FDF4] text-xs font-medium py-2.5 px-4 rounded-xl flex items-center justify-start gap-3 shadow-sm overflow-hidden">
              <Clock className="w-4.5 h-4.5 shrink-0 text-[#86EFAC] animate-pulse" />
              <div className="flex-1 marquee-wrapper font-semibold tracking-wide">
                <span className="marquee-content">{runningText}</span>
              </div>
            </div>

            {/* Dynamic Context Render - Kabupaten Portal directly */}
            {userProposal && (
              <div id="active-context-area" className="transition-all duration-300 relative min-h-[500px]">
                {/* Year Transition Loading Overlay */}
                {isYearTransitioning && (
                  <div className="absolute inset-0 bg-[#F0FDF4]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl animate-fadeIn">
                    <Loader2 className="w-10 h-10 text-[#16A34A] animate-spin mb-4" />
                    <h3 className="text-sm font-bold text-[#166534] tracking-wider uppercase">Menyiapkan Lembar Kerja</h3>
                    <p className="text-xs text-slate-500 mt-1">Sistem sedang memuat data tahun penilaian {systemConfig.assessmentYear}</p>
                  </div>
                )}
                
                <div className={isYearTransitioning ? 'opacity-30 pointer-events-none transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}>
                  {activeMenu === 'rekapitulasi' && (userSession?.role === 'admin' || userSession?.role === 'superadmin') ? (
                    <RekapitulasiData 
                      proposal={userProposal}
                      onUpdateProposal={updateSingleProposal}
                      assessmentYear={systemConfig.assessmentYear || 2026}
                    />
                  ) : activeMenu === 'user-opd' && userSession?.role === 'superadmin' ? (
                    <UserManagement onResetDatabase={handleFullReset} />
                  ) : activeMenu === 'notifikasi' && (userSession?.role === 'admin' || userSession?.role === 'superadmin') ? (
                    <NotificationManagement />
                  ) : (
                    <KabupatenDashboard 
                      proposal={userProposal} 
                      onUpdateProposal={updateSingleProposal}
                      isLockedByDeadline={systemConfig.isTimelockActive}
                      activeMenu={activeMenu}
                      onNavigateMenu={setActiveMenu}
                      userRole={userSession?.role}
                      assessmentYear={systemConfig.assessmentYear || 2026}
                    />
                  )}
                </div>
              </div>
            )}
            
            {/* Standardized Administrative Policy footer */}
            <footer className="pt-6 text-center text-xs text-[#166534]/60 font-medium font-sans border-t border-slate-200 mt-8">
              <p>
                ©2026 Sistem Informasi Pantau Kabupaten/Kota Sehat | SIPANTAS
              </p>
            </footer>
          </div>
        </main>
      </div>

      {isProfileEditOpen && userSession && (
        <ProfileEdit 
          userSession={userSession} 
          onClose={() => setIsProfileEditOpen(false)} 
          onUpdateSession={handleLoginSuccess}
        />
      )}

    </div>
  );

  if (!userSession) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return appContent;
}
