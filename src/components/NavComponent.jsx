import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';

function Sidebar() {
    const { id } = useParams();
    
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
                    {id && (
                        <li>
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <Link to={"/" + id} className="flex items-center px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                        <span className="ms-3">Details</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/" + id + "/Instellingen"} className="flex items-center px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                                        <span className="ms-3">Instellingen</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    )}
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

export { Sidebar };
