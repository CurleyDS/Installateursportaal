import { useState, useEffect } from 'react'
import { useOutletContext, Link } from 'react-router-dom';
import { heatPumpService } from '../services/heatPumpService';
import { filterHeatPumps } from '../utils/heatPumpLogic';
import pumpLogo from '../assets/logo-placeholder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation, faCircleQuestion, faLocationDot, faTemperatureHalf, faGauge, faBolt, faFilePen } from '@fortawesome/free-solid-svg-icons';

import { format } from 'date-fns';

function Home() {
    // Get global filter state from MainLayout
    const { search, filters } = useOutletContext();
    
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
    
    // Filter Logic in Rendering Body
    const filteredHeatPumps = data.filter(item => {
        // Search Filter (Postcode)
        if (search && !item.postcode.toLowerCase().includes(search)) return false;

        // Attribute Filters
        if (filters.fabrikant && item.fabrikant !== filters.fabrikant) return false;
        if (filters.bedrijf && item.bedrijf !== filters.bedrijf) return false;
        if (filters.merk && item.merk !== filters.merk) return false;

        return true;
    });

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

    // NOTE: We no longer need the useEffect that sets 'pompen', we use 'filteredHeatPumps' directly.

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

                {loading && !error && filteredHeatPumps.length === 0 && (
                    <div className="col-span-full p-4 text-center text-gray-500 bg-gray-50 border rounded-lg w-full">
                        <h3 className="text-lg font-medium">No heat pumps found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}

                {filteredHeatPumps.map((pomp, index) => (
                    <Link to={"/" + pomp.id} key={index} className="block w-full min-w-0">
                        <div className="w-full bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow h-full overflow-hidden">
                            <div className="flex items-center justify-between p-6">
                                <p className="mb-3 font-normal text-gray-700 truncate" title={pomp.id}>ID: {pomp.id}</p>
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
