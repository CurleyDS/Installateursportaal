import { useState } from 'react'
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200">
            <div className="h-full px-3 py-4 overflow-y-auto bg-white">
                <Link to="/" className="flex items-center mb-5">
                    <span className="self-center text-xl font-semibold">TDI500</span>
                </Link>
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link to="/" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                            <span className="ms-3">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Onderhoud" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                            <span className="ms-3">Onderhoud</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Storingen" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                            <span className="ms-3">Storingen</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

function Navbar() {
    return (
        <nav className="fixed top-0 left-64 z-40 w-screen bg-white">
            <div className="w-3/5 p-3">
                <input type="text" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Voer klantnaam of locatie in..." />
            </div>
        </nav>
    )
}

export { Sidebar, Navbar };
