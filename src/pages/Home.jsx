import { useState, useEffect } from 'react'
import { heatPumpService } from '../services/heatPumpService';
import pumpLogo from '../assets/logo-placeholder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faTriangleExclamation, faCircleQuestion, faLocationDot, faTemperatureHalf, faGauge, faBolt, faFilePen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { format } from 'date-fns';

function Home() {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd-MM-yyyy HH:mm');
        } catch (e) {
            return dateString;
        }
    };

    const formatValue = (value, unit = '') => {
        return (value !== null && value !== undefined) ? `${value}${unit}` : '-';
    };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const [search, setSearch] = useState(null);
    const [filters, setFilters] = useState({
        fabrikant: null,
        bedrijf: null,
        merk: null
    });
    const [pompen, setPompen] = useState([]);
    const [inputValue, setInputValue] = useState(""); // Controlled input state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await heatPumpService.getAllHeatPumps();
                console.log("Fetched data:", data);
                if (!data) {
                    console.warn("No data received");
                }
                setData(data || []);
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchData();

        // Subscribe to real-time updates
        const subscription = heatPumpService.subscribeToHeatPumps((payload) => {
            console.log('Real-time update received:', payload);
            if (payload.eventType === 'UPDATE') {
                setData((prevData) => {
                    return prevData.map((item) => 
                        item.id === payload.new.id ? payload.new : item
                    );
                });
            } else if (payload.eventType === 'INSERT') {
                setData((prevData) => [...prevData, payload.new]);
            } else if (payload.eventType === 'DELETE') {
                setData((prevData) => prevData.filter((item) => item.id !== payload.old.id));
            }
        });

        // Cleanup subscription on unmount
        return () => {
            if (subscription) {
                heatPumpService.unsubscribe(subscription);
            }
        };
    }, []);

    const filterHeatPumps = (allData, activeFilters, searchTerm) => {
        if (!allData || !Array.isArray(allData)) return [];
        return allData.filter(pomp => {
            // Search (Postcode)
            if (searchTerm) {
                const postcode = pomp.postcode || "";
                if (!postcode.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            }
            // Filter Mapping
            const filterMappings = { bedrijf: 'fabrikant', merk: 'merk' };
            for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
                if (!filterValue) continue;
                const dataKey = filterMappings[filterKey] || filterKey;
                const dataValue = pomp[dataKey];
                if (!dataValue || String(dataValue).toLowerCase() !== String(filterValue).toLowerCase()) return false;
            }
            return true;
        });
    };

    useEffect(() => {
        setPompen(filterHeatPumps(data, filters, search));
    }, [search, filters, data]);

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

    const isSelected = (key, fltrSubject) => {
        if (filters[key] && filters[key].includes(fltrSubject)) {
            return true;
        } else {
            return false;
        }
    }

    const resetFilter = () => {
        setFilters({
            fabrikant: null,
            bedrijf: null,
            merk: null
        });
    }

    const pompStatus = (status) => {
        if (status == 200) {
            return {
                style: "text-green-500",
                icon: faCircleCheck
            };
        } else if (status == 300) {
            return {
                style: "text-yellow-500",
                icon: faTriangleExclamation
            };
        } else if (status == 500) {
            return {
                style: "text-red-500",
                icon: faTriangleExclamation
            };
        } else {
            return {
                style: "text-gray-500",
                icon: faCircleQuestion
            };
        }
    }

    // Helper to get unique values for filters
    const getUniqueValues = (key) => {
        if (!data) return [];
        const values = data.map(item => item[key]).filter(v => v !== null && v !== undefined && v !== '');
        return [...new Set(values)].sort(); // Sort alphabetically
    };

    return (
        <>
            <nav className="fixed top-0 left-64 right-0 z-40 bg-white">
                <div className='flex items-center justify-between w-full p-3'>
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
            <aside id='sidebarFilter' className="fixed top-0 right-0 z-50 w-64 h-screen bg-white border-r border-gray-200 hidden">
                <div className="h-full overflow-y-auto">
                    <div className="p-3 mt-2">
                        <span className='p-2 cursor-pointer' onClick={toggleFilter}>Sluiten</span>
                    </div>
                    <hr />
                    <div className="p-3">
                        <ul className="p-2">
                            <li>
                                <span className="rounded-lg ml-3 cursor-pointer select-none" onClick={() => toggleDropdown('dropdownFabrikantFilter')}>Fabrikant</span>

                                <div id="dropdownFabrikantFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44">
                                    <ul className="text-sm text-gray-700 border rounded-lg my-2">
                                        <li onClick={() => selectFilter({ fabrikant: 'Fabrikant'})}>
                                            <span className="block px-4 py-2 rounded-lg hover:bg-gray-100">Fabrikant Filter</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="rounded-lg ml-3 cursor-pointer select-none" onClick={() => toggleDropdown('dropdownBedrijfFilter')}>Bedrijf</span>

                                <div id="dropdownBedrijfFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44">
                                    <ul className="text-sm text-gray-700 border rounded-lg my-2">
                                        <li onClick={() => selectFilter({ bedrijf: 'Intergas'})}>
                                            <span className="block px-4 py-2 rounded-lg hover:bg-gray-100">Intergas</span>
                                        </li>
                                        <li onClick={() => selectFilter({ bedrijf: 'Remeha'})}>
                                            <span className="block px-4 py-2 rounded-lg hover:bg-gray-100">Remeha</span>
                                        </li>
                                        <li onClick={() => selectFilter({ bedrijf: 'Bosch'})}>
                                            <span className="block px-4 py-2 rounded-lg hover:bg-gray-100">Bosch</span>
                                        </li>
                                        <li onClick={() => selectFilter({ bedrijf: 'Vaillant'})}>
                                            <span className="block px-4 py-2 rounded-lg hover:bg-gray-100">Vaillant</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="rounded-lg ml-3 cursor-pointer select-none" onClick={() => toggleDropdown('dropdownMerkFilter')}>Merk/Type</span>

                                <div id="dropdownMerkFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44">
                                    <ul className="text-sm text-gray-700 border rounded-lg my-2">
                                        <li onClick={() => selectFilter({ merk: 'Merk'})}>
                                            <span className="block px-4 py-2 rounded-lg hover:bg-gray-100">Merk</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <hr />
                    <div className="p-3 mt-2">
                        <span className='p-2 cursor-pointer hover:text-red-500' onClick={resetFilter}>Filters Wissen</span>
                    </div>
                </div>
            </aside>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[2500px]:grid-cols-5 gap-6">
                {error && (
                    <div className="col-span-full p-4 text-red-700 bg-red-100 border border-red-400 rounded w-full">
                        <p className="font-bold">Error loading data:</p>
                        <p>{error.message}</p>
                        <p className="text-sm mt-2">Check your .env.local configuration and database connection.</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="col-span-full p-4 text-center text-gray-500 w-full">
                        <p>Loading...</p>
                    </div>
                )}

                {loading && !error && pompen.length === 0 && (
                    <div className="col-span-full p-4 text-center text-gray-500 bg-gray-50 border rounded-lg w-full">
                        <h3 className="text-lg font-medium">No heat pumps found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}

                {pompen.map((pomp, index) => (
                    <Link to={"/" + pomp.id} key={index} className="block w-full">
                        <div className="w-full bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow h-full">
                            <div className="flex items-center justify-between p-6">
                                <p className="mb-3 font-normal text-gray-700">ID: {pomp.id}</p>
                                <FontAwesomeIcon className={pompStatus(pomp.huidigeStatus).style} icon={pompStatus(pomp.huidigeStatus).icon} />
                            </div>
                            <div className='p-6'>
                                <img src={pumpLogo} alt="" className="w-full h-auto object-contain" />
                            </div>
                            <div className="p-6">
                                <ul>
                                    <li className="py-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faLocationDot} />
                                            <p className="flex-1 ml-4 font-normal text-gray-900">
                                                {pomp.postcode}
                                            </p>
                                        </div>
                                    </li>
                                    <hr />
                                    <li className="py-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faTemperatureHalf} />
                                            <p className="flex-1 ml-4 font-normal text-gray-900">
                                                {formatValue(pomp.huidigeTemperatuur, '°C')}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="py-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faGauge} />
                                            <p className="flex-1 ml-4 font-normal text-gray-900">
                                                {formatValue(pomp.gemiddeldeDruk, ' bar')}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="py-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faBolt} />
                                            <p className="flex-1 ml-4 font-normal text-gray-900">
                                                {formatValue(pomp.vermogen, ' kW')}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="py-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faFilePen} />
                                            <p className="flex-1 ml-4 font-normal text-gray-900">
                                                {formatDate(pomp.laatsteDataUpdate)}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Home
