import { Link, useLocation, useParams } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, Wrench, AlertTriangle, LogOut, X } from 'lucide-react';

function Sidebar({ isOpen, onClose }) {
    const { id } = useParams();
    const location = useLocation();

    const isLinkActive = (key) => {
        const currentPath = location.pathname.toLowerCase();

        // 1. Dashboard (Home)
        if (key === 'home') return currentPath === '/';

        // 2. Global Settings
        if (key === 'settings') return currentPath === '/settings';

        // 3. Specific Sub-pages (Settings, Maintenance, etc.)
        if (['instellingen', 'onderhoud', 'storingen'].includes(key)) {
            return currentPath.endsWith(key);
        }

        // 4. Details (The "Default" View for an ID)
        if (key === 'details') {
            const isSubPage = ['instellingen', 'onderhoud', 'storingen'].some(page => 
                currentPath.endsWith(page)
            );
            return currentPath !== '/' && currentPath !== '/settings' && !isSubPage;
        }
        
        return false;
    };

    const navItemClass = (path, key) => `
        flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-full transition-colors
        ${isLinkActive(key) 
            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}
    `;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
                
                {/* Branding */}
                <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <Link to="/" className="text-2xl font-bold text-blue-900 tracking-tight">
                        TDI<span className="text-blue-600">500</span>
                    </Link>
                    {/* Mobile Close Button */}
                    <button 
                        className="md:hidden p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 space-y-1">
                    <Link to="/" className={navItemClass('/', 'home')}>
                        <LayoutDashboard size={20} />
                        Display
                    </Link>
                    <Link to="/settings" className={navItemClass('/settings', 'settings')}>
                        <Settings size={20} />
                        Instellingen
                    </Link>

                    {/* Contextual Links (Only show when viewing a HeatPump) */}
                    {id && (
                        <>
                            <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Installatie
                            </div>
                            <Link to={`/${id}`} className={navItemClass(`/${id}`, 'details')}>
                                <Activity size={20} />
                                Details
                            </Link>
                            <Link to={`/${id}/Instellingen`} className={navItemClass(`/${id}/Instellingen`, 'instellingen')}>
                                <Wrench size={20} />
                                Apparaat Config
                            </Link>
                        </>
                    )}

                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Beheer
                    </div>
                    <Link to="/Onderhoud" className={navItemClass('/Onderhoud', 'onderhoud')}>
                        <Wrench size={20} />
                        Onderhoud
                    </Link>
                    <Link to="/Storingen" className={navItemClass('/Storingen', 'storingen')}>
                        <AlertTriangle size={20} />
                        Storingen
                    </Link>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <div className="px-4 mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Powered by</p>
                        <p className="text-xl font-bold text-gray-800">Datastekker</p>
                    </div>
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut size={20} />
                        Uitloggen
                    </button>
                </div>
            </aside>
        </>
    );
}

export { Sidebar };
