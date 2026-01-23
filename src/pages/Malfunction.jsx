import { useState, useEffect } from 'react'
import { useOutletContext, Link } from 'react-router-dom';
import { heatPumpService } from '../services/heatPumpService';
import { filterHeatPumps } from '../utils/heatPumpLogic';
import pumpLogo from '../assets/logo-placeholder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

function Malfunction() {
    // Global filter state from MainLayout
    const { search, filters } = useOutletContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [pompen, setPompen] = useState([]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd-MM-yyyy HH:mm');
        } catch (e) {
            return dateString;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch real data from Supabase
                const result = await heatPumpService.getAllHeatPumps();
                setData(result || []);
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // 1. Apply standard filters (Search + Sidebar)
        let filtered = filterHeatPumps(data, filters, search);
        
        // 2. Apply Malfunction-specific filter (Status 500 = Error)
        filtered = filtered.filter(pomp => pomp.huidigeStatus == 500);
        
        setPompen(filtered);
    }, [search, filters, data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[2500px]:grid-cols-5 gap-6">
            {loading && !error && pompen.length === 0 && (
                <div className="col-span-full p-4 text-center text-gray-500 bg-red-50 border border-red-200 rounded-lg w-full">
                    <h3 className="text-lg font-medium text-red-800">Geen storingen</h3>
                    <p className="text-red-700">Er zijn geen warmtepompen gevonden met status 'Storing'.</p>
                </div>
            )}

            {pompen.map((pomp, index) => (
                <Link to={"/" + pomp.id} key={index} className="block w-full min-w-0">
                    <div className="w-full bg-red-50 border border-red-400 rounded-lg hover:shadow-lg transition-shadow h-full overflow-hidden">
                        <div className="flex items-center justify-between p-6">
                            <p className="mb-3 font-normal text-gray-700 truncate" title={pomp.id}>ID: {pomp.id}</p>
                            <FontAwesomeIcon className="text-red-600 text-xl" icon={faTriangleExclamation} />
                        </div>
                        <div className='p-6'>
                            <img src={pumpLogo} alt="" className="w-full h-auto object-contain mix-blend-multiply" />
                        </div>
                        <div className="p-6">
                            <ul>
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-red-700" />
                                        <p className="flex-1 ml-4 font-normal text-gray-900">
                                            {pomp.postcode}
                                        </p>
                                    </div>
                                </li>
                                <hr className="border-red-200" />
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <p className="flex-1 font-normal text-gray-900">
                                            <span className="font-bold text-red-800">Opgetreden sinds:</span><br />
                                            {formatDate(pomp.laatsteDataUpdate)}
                                        </p>
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <p className="flex-1 font-normal text-gray-900 break-words">
                                            <span className="font-bold text-red-800">Storing:</span><br />
                                            {pomp.error_message || "Onbekende storing"}
                                            {pomp.error_code && <span className="block text-sm text-red-600 mt-1">Code: {pomp.error_code}</span>}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Malfunction
