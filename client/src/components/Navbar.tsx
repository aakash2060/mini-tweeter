import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { useState } from 'react';
import { Bell, LogOut, LayoutDashboard, BookOpen, BarChart2, Compass, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/topics',    icon: BookOpen,         label: 'Topics'    },
  { to: '/stats',     icon: BarChart2,        label: 'Stats'     },
  { to: '/recommendations', icon: Compass,   label: 'Discover'  },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NotifDropdown = () => (
    <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40 overflow-hidden">
      {notifications.length === 0
        ? <p className="px-4 py-3 text-sm text-zinc-500">No new notifications</p>
        : notifications.map((n, i) => (
          <Link
            key={i}
            to={`/topics/${n.topicId}`}
            onClick={() => { clearNotifications(); setShowNotifs(false); setMobileOpen(false); }}
            className="block border-b border-zinc-800 px-4 py-3 text-sm last:border-0 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-zinc-400">New message in </span>
            <span className="font-medium text-zinc-100">{n.topicTitle}</span>
          </Link>
        ))
      }
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/dashboard" className="text-lg font-bold text-indigo-400 tracking-tight">
          Mini-Tweeter
        </Link>

        {user && (
          <>
            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}

              {/* Notification bell */}
              <div className="relative ml-1">
                <button
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  onClick={() => { if (showNotifs) clearNotifications(); setShowNotifs(!showNotifs); }}
                >
                  <Bell size={16} />
                  {notifications.length > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifs && <NotifDropdown />}
              </div>

              <div className="ml-2 flex items-center gap-3 border-l border-zinc-800 pl-3">
                <span className="text-sm text-zinc-500">@{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            </div>

            {/* ── Mobile right side ── */}
            <div className="flex md:hidden items-center gap-1">
              <div className="relative">
                <button
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  onClick={() => { if (showNotifs) clearNotifications(); setShowNotifs(!showNotifs); }}
                >
                  <Bell size={16} />
                  {notifications.length > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifs && <NotifDropdown />}
              </div>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Mobile menu ── */}
      {user && mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#09090b] px-4 pb-4 pt-2">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-zinc-800 pt-3">
            <span className="text-sm text-zinc-500">@{user.username}</span>
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
