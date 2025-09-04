import { useState, useEffect } from 'react'
import pumpLogo from '../assets/logo-placeholder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faTriangleExclamation, faCircleQuestion, faLocationDot, faTemperatureHalf, faGauge, faBolt, faFilePen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Home() {
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

    useEffect(() => {
        const fetchData = async () => {
            fetch('/dummy-data.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data.heatpumps);
                setLoading(true);
            })
            .catch((error) => {
                setError(error);
                setLoading(true);
            });
        }

        fetchData();
    }, []);

    useEffect(() => {
        const filterPompen = () => {
            let filteredPompen = [...data];
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null) {
                    filteredPompen = filteredPompen.filter(pomp => pomp[key] === filters[key]);
                }
            });
            if (search !== null) {
                filteredPompen = filteredPompen.filter(pomp => pomp.postcode.toLowerCase().includes(search));
            }
            setPompen(filteredPompen);
        }

        filterPompen();
    }, [search, filters, data]);

    const searchInput = () => {
        const searchValue = document.querySelector('input[type="text"]').value.toLowerCase();
        if (searchValue === '') {
            setSearch(null);
        } else {
            setSearch(searchValue);
        }
    }

    const resetSearch = () => {
        document.querySelector('input[type="text"]').value = '';
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

    return (
        <>
            <nav className="fixed top-0 left-64 z-40 w-full bg-white">
                <div className='flex items-center justify-between w-full'>
                    <div className="flex items-center justify-around w-3/5 p-3">
                        <input className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg mr-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" onChange={searchInput} type="text" placeholder="Voer postcode in..." />
                        {search != null && <FontAwesomeIcon onClick={resetSearch} icon={faXmark} />}
                    </div>
                    <div className='w-1/5 p-3'>
                        <span className='p-2' onClick={toggleFilter}>Filter</span>
                    </div>
                </div>
            </nav>
            <aside id='sidebarFilter' className="fixed top-0 right-0 z-50 w-64 h-screen bg-white border-r border-gray-200 hidden">
                <div className="h-full overflow-y-auto">
                    <div className="p-3 mt-2">
                        <span className='p-2' onClick={toggleFilter}>Sluiten</span>
                    </div>
                    <hr />
                    <div className="p-3">
                        <ul className="p-2">
                            <li>
                                <span className="rounded-lg ml-3" onClick={() => toggleDropdown('dropdownFabrikantFilter')}>Fabrikant</span>

                                <div id="dropdownFabrikantFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li onClick={() => selectFilter({ fabrikant: 'Fabrikant'})}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Fabrikant Filter</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="rounded-lg ml-3" onClick={() => toggleDropdown('dropdownBedrijfFilter')}>Bedrijf</span>

                                <div id="dropdownBedrijfFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li onClick={() => selectFilter({ bedrijf: 'Intergas'})}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Intergas</span>
                                        </li>
                                        <li onClick={() => selectFilter({ bedrijf: 'Remeha'})}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remeha</span>
                                        </li>
                                        <li onClick={() => selectFilter({ bedrijf: 'Bosch'})}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Bosch</span>
                                        </li>
                                        <li onClick={() => selectFilter({ bedrijf: 'Vaillant'})}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Vaillant</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="rounded-lg ml-3" onClick={() => toggleDropdown('dropdownMerkFilter')}>Merk/Type</span>

                                <div id="dropdownMerkFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li onClick={() => selectFilter({ merk: 'Merk'})}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Merk</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <hr />
                    <div className="p-3 mt-2">
                        <span className='p-2' onClick={resetFilter}>Wissen</span>
                    </div>
                </div>
            </aside>
            <div>
                <div className="grid grid-cols-4 gap-4">
                    {pompen.map((pomp, index) => (
                        <Link to={"/" + pomp.id} key={index}>
                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between p-5">
                                    <p className="mb-3 font-normal text-gray-700">ID: {pomp.id}</p>
                                    <FontAwesomeIcon className={pompStatus(pomp.huidigeStatus).style} icon={pompStatus(pomp.huidigeStatus).icon} />
                                </div>
                                <div className='p-5'>
                                    <img src={pumpLogo} alt="" />
                                </div>
                                <div className="p-5">
                                    <ul>
                                        <li className="py-3">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faLocationDot} />
                                                <p className="flex-1 ml-4 font-normal text-gray-900">
                                                    [{pomp.postcode}]
                                                </p>
                                            </div>
                                        </li>
                                        <hr />
                                        <li className="py-3">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faTemperatureHalf} />
                                                <p className="flex-1 ml-4 font-normal text-gray-900">
                                                    {pomp.huidigeTemperatuur}°C
                                                </p>
                                            </div>
                                        </li>
                                        <li className="py-3">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faGauge} />
                                                <p className="flex-1 ml-4 font-normal text-gray-900">
                                                    {pomp.gemiddeldeDruk}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="py-3">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faBolt} />
                                                <p className="flex-1 ml-4 font-normal text-gray-900">
                                                    {pomp.vermogen}kW
                                                </p>
                                            </div>
                                        </li>
                                        <li className="py-3">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faFilePen} />
                                                <p className="flex-1 ml-4 font-normal text-gray-900">
                                                    {pomp.laatsteDataUpdate}
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home
