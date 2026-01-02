import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    LayoutDashboard, Package, FolderTree, Settings,
    ArrowRightLeft, FileText, LogOut, Menu, X,
    Search, ChevronDown, Activity, Bell, User, Users, Inbox, AlertTriangle, Store,
    Sun, Moon
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { settingsApi } from '../../services/adminApi';
import { ThemeProvider, useTheme } from '../../../context/ThemeContext';

const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { path: '/admin/blogs', icon: FileText, label: 'Blog Posts' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/contacts', icon: Inbox, label: 'Inquiries' },
    { path: '/admin/stores', icon: Store, label: 'Store Locator' },
    {
        label: 'SEO Management',
        icon: Search,
        children: [
            { path: '/admin/seo/global', label: 'Global Settings' },
            { path: '/admin/seo/health', label: 'SEO Health' },
            { path: '/admin/seo/redirects', label: 'Redirects' },
        ]
    },
    { path: '/admin/logs', icon: Activity, label: 'Activity Logs' },
    {
        label: 'Settings',
        icon: Settings,
        children: [
            { path: '/admin/profile', label: 'My Profile' },
            { path: '/admin/settings', label: 'System Settings' },
        ]
    },
];

function AdminLayoutContent() {
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState(['SEO Management']);
    const [adminUser, setAdminUser] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check maintenance mode status
    const { data: settings } = useQuery({
        queryKey: ['admin-settings-status'],
        queryFn: () => settingsApi.getSettings().then(r => r.data.data),
        staleTime: 30000 // Check every 30 seconds
    });

    // Load admin user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            try {
                setAdminUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse admin user:', e);
            }
        }
    }, []);

    // Close mobile menu on route change and scroll to top
    useEffect(() => {
        setMobileMenuOpen(false);
        // Scroll content area to top on route change
        const contentArea = document.getElementById('admin-content-area');
        if (contentArea) {
            contentArea.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = (label) => {
        setExpandedMenus(prev =>
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        );
    };

    const handleLogout = () => {
        setLoggingOut(true);
        // Animate out before actual logout
        setTimeout(() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            navigate('/admin/login');
        }, 500);
    };

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f1218] border-r border-gray-800 dark:border-white/5 transition-colors duration-300">
            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-gray-800 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="font-bold text-white">P</span>
                    </div>
                    {(sidebarOpen || mobileMenuOpen) && (
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Admin Panel
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar px-3 space-y-1">
                {menuItems.map((item, idx) => (
                    <div key={idx}>
                        {item.children ? (
                            <div className="mb-2">
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${expandedMenus.includes(item.label)
                                        ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} className={`${expandedMenus.includes(item.label) ? 'text-emerald-500 dark:text-emerald-400' : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400'} transition-colors`} />
                                    {(sidebarOpen || mobileMenuOpen) && (
                                        <>
                                            <span className="flex-1 text-left font-medium">{item.label}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${expandedMenus.includes(item.label) ? 'rotate-180 text-emerald-500 dark:text-emerald-400' : ''}`}
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Submenu */}
                                {(sidebarOpen || mobileMenuOpen) && (
                                    <div className={`overflow-hidden transition-all duration-300 ${expandedMenus.includes(item.label) ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                        <div className="pl-4 space-y-1 border-l border-gray-800 dark:border-white/10 ml-5 my-1">
                                            {item.children.map((child, cIdx) => (
                                                <Link
                                                    key={cIdx}
                                                    to={child.path}
                                                    className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isActive(child.path)
                                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 font-medium'
                                                        : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                                        }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-200 group relative overflow-hidden ${isActive(item.path, item.exact)
                                    ? 'text-white bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {isActive(item.path, item.exact) ? (
                                    // Active state handling for light mode vs dark mode is simpler with just one solid gradient usually,
                                    // but here we use the gradient for both.
                                    null
                                ) : null}
                                <item.icon size={20} className={`${isActive(item.path, item.exact) ? 'text-white' : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400'} transition-colors`} />
                                {(sidebarOpen || mobileMenuOpen) && <span className="font-medium">{item.label}</span>}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-gray-800 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                <div className={`flex items-center gap-3 ${(sidebarOpen || mobileMenuOpen) ? '' : 'justify-center'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border border-gray-800 dark:border-white/10 text-gray-500 dark:text-gray-300">
                        <User size={20} />
                    </div>
                    {(sidebarOpen || mobileMenuOpen) && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{adminUser?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500 truncate">{adminUser?.email || ''}</p>
                        </div>
                    )}
                    {(sidebarOpen || mobileMenuOpen) && (
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        // IMPORTANT: The 'dark' class defaults to applied until theme loads, 
        // but here we toggle it based on the theme context.
        <div className={`${theme} min-h-screen transition-colors duration-300`}>
            <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0c10] text-gray-900 dark:text-gray-100 font-sans selection:bg-emerald-500/30">
                {/* Mobile Sidebar Backdrop */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar (Desktop & Mobile) */}
                <aside
                    className={`
                        fixed lg:static inset-y-0 left-0 z-50 
                         transition-all duration-300 ease-in-out
                        ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
                        ${sidebarOpen ? 'lg:w-72' : 'lg:w-20'}
                    `}
                >
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                    {/* Header */}
                    <header className="h-20 bg-white/80 dark:bg-[#0a0c10]/80 backdrop-blur-md border-b border-gray-800 dark:border-white/5 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                            >
                                <Menu size={24} />
                            </button>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="hidden lg:block p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                            >
                                {sidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
                            </button>

                            <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
                                {location.pathname === '/admin' ? 'Dashboard' :
                                    location.pathname.split('/').slice(2).map(p => p.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(' / ')}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Maintenance Mode Indicator */}
                            {settings?.maintenanceMode && (
                                <Link
                                    to="/admin/settings"
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full hover:bg-amber-100 dark:hover:bg-amber-500/20 animate-pulse transition-all"
                                >
                                    <AlertTriangle size={12} />
                                    Maintenance Mode ON
                                </Link>
                            )}

                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <Link
                                to="/"
                                target="_blank"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-400/20 transition-all"
                            >
                                View Site <ArrowRightLeft size={14} />
                            </Link>

                            <div className="relative">
                                <NotificationDropdown />
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div
                        id="admin-content-area"
                        className={`flex-1 overflow-y-auto custom-scrollbar p-6 scroll-smooth transition-all duration-300 ${loggingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                    >
                        <div className="max-w-7xl mx-auto animate-fade-in-up">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout() {
    return (
        <ThemeProvider>
            <AdminLayoutContent />
        </ThemeProvider>
    );
}
