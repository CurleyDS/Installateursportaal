import { useState, useEffect } from 'react'
import pumpLogo from '../assets/logo-placeholder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation, faLocationDot, faTemperatureHalf, faGauge, faBolt, faFilePen } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [pompen, setPompen] = useState([]);

    useEffect(() => {
        const fetchPompen = async () => {
            fetch('/data.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setPompen(data.heatpumps);
                setLoading(true);
            })
            .catch((error) => {
                setError(error);
                setLoading(true);
            });
        }

        fetchPompen();
    }, []);

    const toggleFilter = () => {
        let sidebarFilter = document.getElementById('sidebarFilter');
        if (sidebarFilter.classList.contains('hidden')) {
            sidebarFilter.classList.remove('hidden');
        } else {
            sidebarFilter.classList.add('hidden');
        }
    }

    const toggleFabrikantDropdown = () => {
        let dropdownFabrikantFilter = document.getElementById('dropdownFabrikantFilter');
        if (dropdownFabrikantFilter.classList.contains('hidden')) {
            dropdownFabrikantFilter.classList.remove('hidden');
        } else {
            dropdownFabrikantFilter.classList.add('hidden');
        }
    }

    const toggleBedrijfDropdown = () => {
        let dropdownBedrijfFilter = document.getElementById('dropdownBedrijfFilter');
        if (dropdownBedrijfFilter.classList.contains('hidden')) {
            dropdownBedrijfFilter.classList.remove('hidden');
        } else {
            dropdownBedrijfFilter.classList.add('hidden');
        }
    }

    const toggleMerkDropdown = () => {
        let dropdownMerkFilter = document.getElementById('dropdownMerkFilter');
        if (dropdownMerkFilter.classList.contains('hidden')) {
            dropdownMerkFilter.classList.remove('hidden');
        } else {
            dropdownMerkFilter.classList.add('hidden');
        }
    }

    const pompStatus = (status) => {
        if (status == 'active') {
            return {
                style: "text-green-500",
                icon: faCircleCheck
            };
        } else if (status == 'onderhoud') {
            return {
                style: "text-yellow-500",
                icon: faTriangleExclamation
            };
        } else if (status == 'storing') {
            return {
                style: "text-red-500",
                icon: faTriangleExclamation
            };
        }
    }

    return (
        <>
            <nav className="fixed top-0 left-64 z-40 w-screen bg-white">
                <div className='flex items-center justify-between w-full'>
                    <div className="w-3/5 p-3">
                        <input type="text" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Voer klantnaam of locatie in..." />
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
                    <div className="p-3">
                        <ul className="p-2">
                            <li>
                                <span className="rounded-lg ml-3" onClick={toggleFabrikantDropdown}>Fabrikant</span>

                                <div id="dropdownFabrikantFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Fabrikant Filter</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="rounded-lg ml-3" onClick={toggleBedrijfDropdown}>Bedrijf</span>

                                <div id="dropdownBedrijfFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Intergas</span>
                                        </li>
                                        <li>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remeha</span>
                                        </li>
                                        <li>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Bosch</span>
                                        </li>
                                        <li>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Vaillant</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <span className="rounded-lg ml-3" onClick={toggleMerkDropdown}>Merk/Type</span>

                                <div id="dropdownMerkFilter" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Merk</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
            <div className="ml-64 p-4">
                <div className="grid grid-cols-4 gap-4">
                    {pompen.map(pomp => (
                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg" key={pomp.id}>
                            <div className="flex items-center justify-between p-5">
                                <p className="mb-3 font-normal text-gray-700">ID: {pomp.id}</p>
                                <FontAwesomeIcon className={pompStatus(pomp.status).style} icon={pompStatus(pomp.status).icon} />
                            </div>
                            <div className='p-5'>
                                <img src={pumpLogo} alt="" />
                            </div>
                            <div className="p-5">
                                <ul role="list">
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
                                                {pomp.Druk}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="py-3">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faBolt} />
                                            <p className="flex-1 ml-4 font-normal text-gray-900">
                                                {pomp.Vermogen}kW
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
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home
