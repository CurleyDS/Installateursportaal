import { useState, useEffect } from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
// import reactLogo from '../assets/react.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const pompData = [
      { x: 1, y: 160 }, { x: 2, y: 160 }, { x: 3, y: 165 },
      { x: 4, y: 155 }, { x: 5, y: 162 }, { x: 6, y: 167 },
      { x: 7, y: 164 }, { x: 8, y: 162 }, { x: 9, y: 159 },
      { x: 10, y: 164 }, { x: 11, y: 166 }, { x: 12, y: 167 },
      { x: 13, y: 167 }, { x: 14, y: 165 }, { x: 15, y: 163 },
      { x: 16, y: 160 }, { x: 17, y: 159 }, { x: 18, y: 158 },
      { x: 19, y: 161 }, { x: 20, y: 163 }, { x: 21, y: 165 },
      { x: 22, y: 165 }, { x: 23, y: 164 }, { x: 24, y: 164 },
      { x: 25, y: 163 }, { x: 26, y: 162 }, { x: 27, y: 161 },
      { x: 28, y: 161 }, { x: 29, y: 161 }, { x: 30, y: 165 },
      { x: 31, y: 155 }
];

function Home() {
    const [wijken, setWijken] = useState([]);
    const [selectedWijk, setSelectedWijk] = useState(null);
    const [pompen, setPompen] = useState([]);

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
                { id: 1, naam: 'Wijk 1', actieveWarmtepompen: 3, totaalVerbruik: '22.2kW', geschatteFlexibiliteit: '5.6kW', netStatus: 'good' },
                { id: 2, naam: 'Wijk 2', actieveWarmtepompen: 6, totaalVerbruik: '54.6kW', geschatteFlexibiliteit: '13.3kW', netStatus: 'good' },
                { id: 3, naam: 'Wijk 3', actieveWarmtepompen: 4, totaalVerbruik: '39.7kW', geschatteFlexibiliteit: '7.8kW', netStatus: 'good' },
                { id: 4, naam: 'Wijk 4', actieveWarmtepompen: 5, totaalVerbruik: '46.5kW', geschatteFlexibiliteit: '3kW', netStatus: 'bad' }
            ];
            setWijken(data);
        };

        const fetchpompen = async () => {
            const heatPumpsData = [
                { id: 1, wijk_id: 1, klant: 'Intergas', postcode: 'postcode 1', huidigeTemperatuur: '20', Druk: '1.2', Vermogen: '5.5kW', laatsteDataUpdate: '19-03', status: 'active' },
                { id: 2, wijk_id: 1, klant: 'Remeha', postcode: 'postcode 2', huidigeTemperatuur: '21', Druk: '1.3', Vermogen: '5.7kW', laatsteDataUpdate: '19-03', status: 'onderhoud' },
                { id: 3, wijk_id: 1, klant: 'Bosch', postcode: 'postcode 3', huidigeTemperatuur: '19', Druk: '1.1', Vermogen: '5.6kW', laatsteDataUpdate: '2023', status: 'storing' },
                { id: 4, wijk_id: 1, klant: 'Vaillant', postcode: 'postcode 4', huidigeTemperatuur: '18', Druk: '1.0', Vermogen: '4.3kW', laatsteDataUpdate: '19-03', status: 'active' },
            ];
            setPompen(heatPumpsData);
        }

        fetchWijken();
        fetchpompen();
    }, []);

    useEffect(() => {
        if (selectedWijk !== null) {
            const selected = wijken[selectedWijk];
        }
    }, [selectedWijk, wijken]);

    // { data: [160, 160, 165, 155, 162, 167, 159, 164, 166, 167, 167, 165, 163, 160, 159, 158, 161, 163, 165, 164, 163, 162, 161, 161, 165, 155] }
    // { data: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 29, 30, 31] }

    return (
        <div className="ml-64 p-4">
            <LineChart
                dataset={pompData}
                xAxis={[{
                    dataKey: 'x',
                    label: 'Dag',
                    scaleType: 'linear',
                    tickMaxStep: 1,
                }]}
                yAxis={[{
                    label: 'Warmtepompverbruik (kW)',
                    min: 0,
                    max: 200,
                }]}
                series={[{
                    dataKey: 'y',
                    label: 'Verbruik',
                    showMark: true,
                }]}
                height={300}
            />
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
                                    {wijk.actieveWarmtepompen}
                                </td>
                                <td className="px-6 py-4">
                                    {wijk.totaalVerbruik}
                                </td>
                                <td className="px-6 py-4">
                                    {wijk.geschatteFlexibiliteit}
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
