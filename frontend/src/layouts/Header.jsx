import {
  Menu,
  Search,
  Bell,
  X,
  ChevronDown,
  User2,
  LogOut,
} from "lucide-react";

export default function Header({
  location,
  setMobileOpen,
  isAdmin,
  notifOpen,
  setNotifOpen,
  totalUnread,
  notifications,
  handleNotifClick,
  profileRef,
  profileOpen,
  setProfileOpen,
  displayName,
  user,
  avatarUrl,
  initials,
  goProfile,
  handleLogout,
}) {
  return (
    <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 transition-all duration-300">
      
      {/* LEFT: Mobile Menu & Breadcrumb/Title */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileOpen(true)}
        >
          <Menu />
        </button>

        <div>
          <h2 className="text-xl font-black text-slate-800 capitalize tracking-tight">
            {location.pathname.split("/").pop()?.replace("-", " ")}
          </h2>
          {/* Optional Breadcrumb detail */}
          <p className="hidden md:block text-xs font-medium text-slate-400">
            Overview
          </p>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-slate-100/50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all w-64">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Type to search..."
            className="bg-transparent border-none text-sm ml-2 w-full outline-none text-slate-700 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* NOTIFICATIONS */}
        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setNotifOpen((s) => !s)}
              className={`relative p-2.5 rounded-full transition-all duration-200 ${
                notifOpen 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bell size={20} />
              {totalUnread > 0 && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white border border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="font-bold text-slate-800">Notifications</span>
                  {totalUnread > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {totalUnread} New
                    </span>
                  )}
                </div>

                <div className="max-h-[20rem] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-slate-400">
                      <Bell size={32} className="mb-2 opacity-20" />
                      <p className="text-sm font-medium">No new updates</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n.to, n.status)}
                        className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              n.status === "PENDING"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {n.status}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {n.desc}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        <div className="relative pl-3 md:pl-6 md:border-l border-slate-200" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((s) => !s)}
            className={`flex items-center gap-3 p-1 rounded-xl transition-all duration-200 ${
                profileOpen ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none mb-1">
                {displayName}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {user.role}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-md overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-black text-slate-800 truncate">{user.email || displayName}</p>
                </div>
              
              <div className="p-1">
                <button
                    onClick={goProfile}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                    <User2 size={18} />
                    My Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}