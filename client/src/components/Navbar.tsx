import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { useState } from 'react';
import { Bell, LogOut, LayoutDashboard, BookOpen, BarChart2, GitBranch } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link to="/dashboard" className="text-lg font-bold text-indigo-400 tracking-tight">
          Mini-Tweeter
        </Link>

        {user && (
          <div className="flex items-center gap-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
            <Link
              to="/topics"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <BookOpen size={15} />
              Topics
            </Link>
            <Link
              to="/stats"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <BarChart2 size={15} />
              Stats
            </Link>
            <Link
              to="/recommendations"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <GitBranch size={15} />
              Graph
            </Link>

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

              {showNotifs && (
                <div className="absolute right-0 top-11 w-72 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40 overflow-hidden">
                  {notifications.length === 0
                    ? <p className="px-4 py-3 text-sm text-zinc-500">No new notifications</p>
                    : notifications.map((n, i) => (
                      <div key={i} className="border-b border-zinc-800 px-4 py-3 text-sm last:border-0">
                        <span className="text-zinc-400">New message in </span>
                        <span className="font-medium text-zinc-200">{n.topicTitle}</span>
                      </div>
                    ))
                  }
                </div>
              )}
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
        )}
      </div>
    </nav>
  );
};
