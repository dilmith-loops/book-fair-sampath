import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  Pin,
  Trash2,
  Plus,
  Megaphone,
  Building2,
  Users,
  BarChart3,
  Search,
  Lock,
  CheckCircle2,
  Eye,
  Key,
  LogOut,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Stall, BookSpotting, UserProfile, Announcement } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: BookSpotting[];
  stalls: Stall[];
  announcements: Announcement[];
  registeredUsers?: UserProfile[];
  onDeleteSpot: (spotId: string) => void;
  onTogglePinSpot: (spotId: string) => void;
  onToggleAiVerified: (spotId: string) => void;
  onUpdateSpotStatus: (spotId: string, status: BookSpotting['status']) => void;
  onAddStall: (stall: Stall) => void;
  onDeleteStall: (stallId: string) => void;
  onPublishAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onToggleUserCardholder?: (handle: string) => void;
}

type AdminTab = 'overview' | 'spots' | 'stalls' | 'announcements' | 'users';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  spots,
  stalls,
  announcements,
  registeredUsers = [],
  onDeleteSpot,
  onTogglePinSpot,
  onToggleAiVerified,
  onUpdateSpotStatus,
  onAddStall,
  onDeleteStall,
  onPublishAnnouncement,
  onDeleteAnnouncement,
  onToggleUserCardholder
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // New Stall Form
  const [newStallName, setNewStallName] = useState('');
  const [newStallHall, setNewStallHall] = useState('Hall A');
  const [newStallNumber, setNewStallNumber] = useState('');
  const [newStallCategory, setNewStallCategory] = useState('General Books & Fiction');
  const [newStallDiscount, setNewStallDiscount] = useState('15% Instant Off with Sampath Card');

  // Announcement Form
  const [annMessage, setAnnMessage] = useState('');
  const [annType, setAnnType] = useState<Announcement['type']>('discount');

  // Search Filters
  const [spotFilterSearch, setSpotFilterSearch] = useState('');
  const [stallFilterSearch, setStallFilterSearch] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Use 1234 to enter admin mode.');
    }
  };

  const handleCreateStall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStallName.trim() || !newStallNumber.trim()) return;

    const stall: Stall = {
      id: `stall-${Date.now()}`,
      name: newStallName.trim(),
      hall: newStallHall,
      stallNumber: newStallNumber.trim(),
      category: newStallCategory,
      specialDiscount: newStallDiscount.trim() || undefined
    };

    onAddStall(stall);
    setNewStallName('');
    setNewStallNumber('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annMessage.trim()) return;

    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      message: annMessage.trim(),
      type: annType,
      createdAt: Date.now(),
      isActive: true,
      publishedBy: 'Fair Admin'
    };

    onPublishAnnouncement(ann);
    setAnnMessage('');
  };

  const filteredSpots = spots.filter(
    (s) =>
      s.bookName.toLowerCase().includes(spotFilterSearch.toLowerCase()) ||
      s.stallName.toLowerCase().includes(spotFilterSearch.toLowerCase()) ||
      s.finderName.toLowerCase().includes(spotFilterSearch.toLowerCase())
  );

  const filteredStalls = stalls.filter(
    (s) =>
      s.name.toLowerCase().includes(stallFilterSearch.toLowerCase()) ||
      s.stallNumber.toLowerCase().includes(stallFilterSearch.toLowerCase()) ||
      s.hall.toLowerCase().includes(stallFilterSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-white min-h-screen w-full overflow-y-auto flex flex-col font-sans selection:bg-[#F37021] selection:text-white animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F37021] to-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                BMICH Book Spotter Control Center
              </h1>
              <span className="text-[10px] bg-[#F37021]/20 text-[#F37021] font-black px-2 py-0.5 rounded-full border border-[#F37021]/30 uppercase tracking-wider">
                Official Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium hidden sm:block">
              Colombo International Book Fair 2026 • Sponsored by Sampath Bank PLC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Lock Console"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Console</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F37021] hover:bg-[#EA580C] text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public App</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      {!isAuthenticated ? (
        /* Full-Screen Lock Screen */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#F37021] shadow-inner mx-auto">
              <Lock className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">Administrator Access Required</h2>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Enter your administrative PIN passcode to access post moderation, stall management, and broadcast alerts.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Passcode (1234)"
                  className="w-full px-4 py-3.5 bg-zinc-950 border border-zinc-700 rounded-2xl text-center text-base font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs font-bold text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#F37021] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Full Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Full-Screen Dashboard Layout */
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col space-y-6">
          {/* Dashboard Navigation Tabs Bar */}
          <div className="bg-zinc-900 p-2 rounded-2xl border border-zinc-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#F37021] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('spots')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'spots'
                  ? 'bg-[#F37021] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Feed & Post Moderation ({spots.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stalls')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'stalls'
                  ? 'bg-[#F37021] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>BMICH Stalls Directory ({stalls.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'announcements'
                  ? 'bg-[#F37021] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Banners ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-[#F37021] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Spotters ({registeredUsers.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Total Spot Posts
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {spots.filter((s) => s.postType !== 'request').length}
                  </div>
                  <span className="text-xs text-emerald-400 font-bold block">
                    Active Spotter Discoveries
                  </span>
                </div>

                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Book Requests
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#F37021]/20 text-[#F37021] flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#F37021]">
                    {spots.filter((s) => s.postType === 'request').length}
                  </div>
                  <span className="text-xs text-orange-400 font-bold block">
                    Visitors Seeking Specific Books
                  </span>
                </div>

                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      BMICH Stalls
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">{stalls.length}</div>
                  <span className="text-xs text-zinc-400 font-bold block">
                    Registered Across Halls A - E
                  </span>
                </div>

                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Sampath Discounts
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-purple-400">
                    {stalls.filter((s) => s.specialDiscount).length}
                  </div>
                  <span className="text-xs text-purple-400 font-bold block">
                    Participating Cardholder Offers
                  </span>
                </div>
              </div>

              {/* System Health Status */}
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Sampath AI Safety & Moderation Status</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-400 font-medium">Multilingual Profanity Filter</span>
                    <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Active & Operational</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-400 font-medium">Auto AI Spot Verification</span>
                    <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Verified Badges Active</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-400 font-medium">Image Multimodal Guardian</span>
                    <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Photo Scanning Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPOTS MODERATION */}
          {activeTab === 'spots' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={spotFilterSearch}
                    onChange={(e) => setSpotFilterSearch(e.target.value)}
                    placeholder="Search spots by title, stall, or finder handle..."
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  />
                </div>
                <div className="text-xs font-bold text-zinc-400 self-end sm:self-center">
                  Showing {filteredSpots.length} of {spots.length} community posts
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className={`p-4 bg-zinc-900 border rounded-2xl flex flex-col justify-between space-y-3 ${
                      spot.isPinned
                        ? 'border-[#F37021] bg-[#F37021]/10'
                        : 'border-zinc-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {spot.isPinned && (
                            <span className="text-[10px] bg-[#F37021] text-white font-black px-2 py-0.5 rounded flex items-center gap-1">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded ${
                              spot.postType === 'request'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {spot.postType === 'request' ? 'Request' : 'Found Spot'}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 font-medium">
                          {new Date(spot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white">{spot.bookName}</h4>

                      <div className="text-xs text-zinc-400 font-medium">
                        Stall: <strong className="text-zinc-200">{spot.stallName}</strong> ({spot.hall} - {spot.stallNumber})
                      </div>

                      <div className="text-xs text-zinc-400 font-medium">
                        Spotter: <span className="text-[#F37021] font-bold">{spot.finderName}</span> ({spot.finderHandle})
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTogglePinSpot(spot.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                            spot.isPinned
                              ? 'bg-[#F37021] text-white border-[#F37021]'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                          <span>{spot.isPinned ? 'Unpin' : 'Pin Post'}</span>
                        </button>

                        <button
                          onClick={() => onToggleAiVerified(spot.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                            spot.aiVerified
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{spot.aiVerified ? 'AI Verified' : 'Verify'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => onDeleteSpot(spot.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STALLS MANAGEMENT */}
          {activeTab === 'stalls' && (
            <div className="space-y-6">
              {/* Create Stall Form */}
              <form onSubmit={handleCreateStall} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4 shadow-md">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#F37021] flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Register New BMICH Fair Stall</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Publisher / Stall Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Vijitha Yapa Publications"
                      value={newStallName}
                      onChange={(e) => setNewStallName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Hall Location *</label>
                    <select
                      value={newStallHall}
                      onChange={(e) => setNewStallHall(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    >
                      <option value="Hall A">Hall A</option>
                      <option value="Hall B">Hall B</option>
                      <option value="Hall C">Hall C</option>
                      <option value="Hall D">Hall D</option>
                      <option value="Hall E">Hall E</option>
                      <option value="Sirimavo Hall">Sirimavo Hall</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Stall Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. A-14"
                      value={newStallNumber}
                      onChange={(e) => setNewStallNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Children's Books, Fiction, Academic"
                      value={newStallCategory}
                      onChange={(e) => setNewStallCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Sampath Cardholder Special Offer</label>
                    <input
                      type="text"
                      placeholder="e.g. 15% Instant Discount"
                      value={newStallDiscount}
                      onChange={(e) => setNewStallDiscount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#F37021] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stall Entry</span>
                </button>
              </form>

              {/* Stalls List Grid */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={stallFilterSearch}
                    onChange={(e) => setStallFilterSearch(e.target.value)}
                    placeholder="Search stalls by publisher name, category, or stall number..."
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredStalls.map((stall) => (
                    <div
                      key={stall.id}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{stall.name}</h4>
                        <div className="text-xs text-zinc-400 mt-1 font-medium">
                          {stall.hall} • Stall <strong className="text-zinc-200">{stall.stallNumber}</strong>
                        </div>
                        <span className="inline-block mt-1.5 text-[10px] font-bold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                          {stall.category}
                        </span>

                        {stall.specialDiscount && (
                          <div className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
                            <span>🎁 {stall.specialDiscount}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteStall(stall.id)}
                        className="w-full py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Stall</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <form onSubmit={handleCreateAnnouncement} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4 shadow-md">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#F37021] flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  <span>Publish Live Announcement Banner</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as Announcement['type'])}
                    className="px-3.5 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-bold"
                  >
                    <option value="discount">Discount Alert 🎁</option>
                    <option value="urgent">Urgent Notice ⚡</option>
                    <option value="info">Fair Announcement 📢</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Announcement message (e.g. Flash 20% discount at Hall C!)..."
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    className="sm:col-span-3 px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#F37021] hover:bg-[#EA580C] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Publish Live Banner</span>
                </button>
              </form>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Active & Past Announcements ({announcements.length})
                </h4>

                <div className="space-y-2">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#F37021]/20 text-[#F37021] border border-[#F37021]/30">
                          {ann.type}
                        </span>
                        <span className="text-zinc-200 font-bold">{ann.message}</span>
                      </div>

                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REGISTERED USERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                Registered Community Spotters ({registeredUsers.length})
              </h3>

              {registeredUsers.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs font-semibold bg-zinc-900 rounded-2xl border border-zinc-800">
                  No users registered in local storage yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {registeredUsers.map((u) => (
                    <div
                      key={u.handle}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-black text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className="text-zinc-400 text-xs font-semibold">{u.handle}</span>
                        </div>
                        <div className="text-zinc-400 text-xs">
                          📞 {u.phone} • ✉️ {u.email}
                        </div>
                        {u.isSampathCardholder && (
                          <span className="inline-block text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black border border-emerald-500/30 mt-1">
                            Sampath Cardholder
                          </span>
                        )}
                      </div>

                      {onToggleUserCardholder && (
                        <button
                          onClick={() => onToggleUserCardholder(u.handle)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold cursor-pointer transition-colors"
                        >
                          Toggle Cardholder
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
