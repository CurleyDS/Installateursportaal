import { useState, useEffect } from 'react'
// import reactLogo from '../assets/react.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const [wijken, setWijken] = useState([])
    const [selectedWijk, setSelectedWijk] = useState(null);

    const selectWijk = (index) => {
        if (selectedWijk === index) {
            // showPompen()
        } else (
            setSelectedWijk(index)
        )
    }

    useEffect(() => {
        const fetchWijken = async () => {
            const data = [
                { name: 'Wijk 1', activeHeatPumps: 3, totalConsumption: '22.2kW', estimatedFlexibility: '5.6kW', netStatus: 'good' },
                { name: 'Wijk 2', activeHeatPumps: 6, totalConsumption: '54.6kW', estimatedFlexibility: '13.3kW', netStatus: 'good' },
                { name: 'Wijk 3', activeHeatPumps: 4, totalConsumption: '39.7kW', estimatedFlexibility: '7.8kW', netStatus: 'good' },
                { name: 'Wijk 4', activeHeatPumps: 5, totalConsumption: '46.5kW', estimatedFlexibility: '3kW', netStatus: 'warning' }
            ];
            setWijken(data);
        };

        fetchWijken();
    }, []);

    return (
        <div className="ml-64 p-4">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Wijk
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actieve Warmtepompen
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Totaal verbruik
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Geschatte flexibiliteit
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Netstatus
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {wijken.map((wijk, index) => (
                            <tr
                                key={index}
                                className={
                                    selectedWijk === index
                                        ? "bg-gray-200 border border-gray-700"
                                        : "bg-white border-b border-gray-200"
                                }
                                onClick={() => selectWijk(index)}
                            >
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                                    {wijk.name}
                                </th>
                                <td className="px-6 py-4">
                                    {wijk.activeHeatPumps}
                                </td>
                                <td className="px-6 py-4">
                                    {wijk.totalConsumption}
                                </td>
                                <td className="px-6 py-4">
                                    {wijk.estimatedFlexibility}
                                </td>
                                <td className="px-6 py-4">
                                    {wijk.netStatus === 'good' ? (
                                        <FontAwesomeIcon icon={faCircleCheck} className='text-green-600' />
                                    ) : (
                                        <FontAwesomeIcon icon={faTriangleExclamation} className='text-red-600' />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home
