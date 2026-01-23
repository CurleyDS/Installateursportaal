import { useState } from 'react';
import { Outlet, useParams, useOutletContext } from 'react-router-dom';
import { Sidebar } from '../components/NavigationComponent';
import { NotificationToggle } from '../components/NotificationComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons';

function Main() {
    const { id } = useParams();
    
    // Global Search & Filter State
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [filters, setFilters] = useState({
        fabrikant: null,
        bedrijf: null,
        merk: null
    });

    // Handlers
    const handleSearch = (e) => {
        const val = e.target.value;
        setInputValue(val);
        setSearch(val === '' ? null : val.toLowerCase());
    }

    const resetSearch = () => {
        setInputValue("");
        setSearch(null);
    }

    const toggleFilter = () => {
        let sidebarFilter = document.getElementById('sidebarFilter');
        if (sidebarFilter.classList.contains('hidden')) {
            sidebarFilter.classList.remove('hidden');
        } else {
            sidebarFilter.classList.add('hidden');
        }
    }

    const toggleDropdown = (dropdownId) => {
        let dropdownFilter = document.getElementById(dropdownId);
        if (dropdownFilter.classList.contains('hidden')) {
            dropdownFilter.classList.remove('hidden');
        } else {
            dropdownFilter.classList.add('hidden');
        }
    }

    const selectFilter = (filter) => {
        const key = Object.keys(filter)[0];
        const newFilters = { ...filters };

        if (filters[key] !== null) {
            if (filters[key] === filter[key]) {
                newFilters[key] = null;
            } else {
                newFilters[key] = filter[key];
            }
        } else {
            newFilters[key] = filter[key];
        }

        setFilters(newFilters);
    }

    const resetFilter = () => {
        setFilters({ fabrikant: null, bedrijf: null, merk: null });
    }

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Top Navigation Bar - Fixed */}
            <nav className="fixed top-0 left-0 md:left-64 right-0 z-40 bg-white border-b border-gray-200">
                <div className='flex items-center justify-between w-full p-3 gap-3'>
                    
                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                    >
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>

                    <div className="flex items-center justify-around w-full">
                        <input 
                            className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg mr-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                            onChange={handleSearch} 
                            value={inputValue} 
                            type="text" 
                            placeholder="Voer postcode in..." 
                        />
                        {search != null && <FontAwesomeIcon className="cursor-pointer" onClick={resetSearch} icon={faXmark} />}
                    </div>
                    <div>
                        <span className='p-2 cursor-pointer' onClick={toggleFilter}>Filter</span>
                    </div>
                </div>
            </nav>

            {/* Filter Sidebar - Fixed Right */}
            <aside id='sidebarFilter' className="fixed top-0 right-0 z-50 w-64 h-screen bg-white border-l border-gray-200 hidden shadow-xl">
                <div className="h-full overflow-y-auto">
                    <div className="p-3 mt-2 flex justify-between items-center">
                        <h3 className="font-semibold">Filters</h3>
                        <span className='p-2 cursor-pointer text-gray-500' onClick={toggleFilter}>Sluiten</span>
                    </div>
                    <hr />
                    <div className="p-3">
                        <ul className="p-2 space-y-2">
                            <li>
                                <span className="block p-2 rounded-lg hover:bg-gray-50 cursor-pointer select-none font-medium" onClick={() => toggleDropdown('dropdownFabrikantFilter')}>Fabrikant</span>
                                <div id="dropdownFabrikantFilter" className="hidden pl-4">
                                    <ul className="text-sm text-gray-700 my-2">
                                        <li onClick={() => selectFilter({ fabrikant: 'Fabrikant'})} className={`cursor-pointer p-2 rounded ${filters.fabrikant ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                                            Fabrikant Filter
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="block p-2 rounded-lg hover:bg-gray-50 cursor-pointer select-none font-medium" onClick={() => toggleDropdown('dropdownBedrijfFilter')}>Bedrijf</span>
                                <div id="dropdownBedrijfFilter" className="hidden pl-4">
                                    <ul className="text-sm text-gray-700 my-2 space-y-1">
                                        {['Intergas', 'Remeha', 'Bosch', 'Vaillant'].map(brand => (
                                            <li key={brand} onClick={() => selectFilter({ bedrijf: brand})} className={`cursor-pointer p-2 rounded ${filters.bedrijf === brand ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                                                {brand}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="block p-2 rounded-lg hover:bg-gray-50 cursor-pointer select-none font-medium" onClick={() => toggleDropdown('dropdownMerkFilter')}>Merk/Type</span>
                                <div id="dropdownMerkFilter" className="hidden pl-4">
                                    <ul className="text-sm text-gray-700 my-2">
                                        <li onClick={() => selectFilter({ merk: 'Merk'})} className={`cursor-pointer p-2 rounded ${filters.merk ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                                            Merk
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>0 md:ml-
                    <hr />
                    <div className="p-3 mt-2">
                        <button className='w-full p-2 text-red-500 border border-red-200 rounded hover:bg-red-50' onClick={resetFilter}>Filters Wissen</button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 overflow-x-hidden pt-20">
                {/* Clean Wrapper: Percentage width, no scaling transforms */}
                <div className="w-[95%] mx-auto p-4">
                    <Outlet context={{ search, filters }} />
                </div>
            </main>
            <NotificationToggle />
        </>
    );
}

export default Main;