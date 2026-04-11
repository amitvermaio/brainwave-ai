import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { asynclogoutuser } from '../../store/actions/authActions';
import { LayoutDashboard, FileText, User, LogOut, BrainCircuit, BookOpen, X, AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await dispatch(asynclogoutuser());
      setIsLogoutModalOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300
        ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/60 z-50 md:relative md-w-64 md:shrink-0 md:flex md:flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo and close button for mobile */}
        <div className='flex items-center justify-between h-16 px-5 border-b border-slate-200/60'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30'>
              <BrainCircuit className='text-white' size={20} strokeWidth={2.5} />
            </div>
            <h1 className='text-sm md:text-base font-bold text-slate-900 tracking-tight'>
              AI Learning Assistant
            </h1>
          </div>
          <button onClick={toggleSidebar} className='md:hidden text-slate-500 hover:text-slate-800'>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3 py-6 space-y-1.5'>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/25'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'
                      }`}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className='px-3 py-4 border-t border-slate-200/60'>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className='group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200'
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
              className='transition-transform duration-200 group-hover:scale-110'
            />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => !loggingOut && setIsLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <div className='space-y-6'>
          {/* Warning icon + message */}
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 border border-red-100'>
              <AlertTriangle className='w-5 h-5 text-red-500' strokeWidth={2} />
            </div>
            <div>
              <p className='text-sm font-medium text-slate-900'>
                Are you sure you want to logout?
              </p>
              <p className='text-sm text-slate-500 mt-1'>
                You'll need to sign in again to access your documents and flashcards.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-2'>
            <Button
              variant='secondary'
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={loggingOut}
            >
              Cancel
            </Button>
            <Button
              variant='danger'
              onClick={handleLogoutConfirm}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut size={15} strokeWidth={2.5} />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;