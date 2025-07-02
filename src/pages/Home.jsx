import { useState, useEffect } from 'react'
import pumpLogo from '../assets/logo-placeholder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation, faLocationDot, faTemperatureHalf, faGauge, faBolt, faFilePen } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const [pompen, setPompen] = useState([]);

    useEffect(() => {
        const fetchPompen = async () => {
            const heatPumpsData = [
                { id: 1, wijk_id: 1, eigenaar: 'Intergas', postcode: 'postcode 1', huidigeTemperatuur: '20', Druk: '1.2', Vermogen: '5.5kW', laatsteDataUpdate: '19-03', status: 'active' },
                { id: 2, wijk_id: 1, eigenaar: 'Remeha', postcode: 'postcode 2', huidigeTemperatuur: '21', Druk: '1.3', Vermogen: '5.7kW', laatsteDataUpdate: '19-03', status: 'onderhoud' },
                { id: 3, wijk_id: 1, eigenaar: 'Bosch', postcode: 'postcode 3', huidigeTemperatuur: '19', Druk: '1.1', Vermogen: '5.6kW', laatsteDataUpdate: '2023', status: 'storing' },
                { id: 4, wijk_id: 1, eigenaar: 'Vaillant', postcode: 'postcode 4', huidigeTemperatuur: '18', Druk: '1.0', Vermogen: '4.3kW', laatsteDataUpdate: '19-03', status: 'active' },
            ];
            setPompen(heatPumpsData);
        }

        fetchPompen();
    }, []);

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

    // const pompList = ;

    return (
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
                                            [postcode]
                                        </p>
                                    </div>
                                </li>
                                <hr />
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faTemperatureHalf} />
                                        <p className="flex-1 ml-4 font-normal text-gray-900">
                                            20°C
                                        </p>
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faGauge} />
                                        <p className="flex-1 ml-4 font-normal text-gray-900">
                                            1.2
                                        </p>
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faBolt} />
                                        <p className="flex-1 ml-4 font-normal text-gray-900">
                                            5.5kW
                                        </p>
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faFilePen} />
                                        <p className="flex-1 ml-4 font-normal text-gray-900">
                                            19-03
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
