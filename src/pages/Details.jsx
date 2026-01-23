import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { heatPumpService } from '../services/heatPumpService';
import { LineChart } from '@mui/x-charts/LineChart';
import { format } from 'date-fns';

function Details() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [pomp, setPomp] = useState({});
    const [currentChartData, setCurrentChartData] = useState([]);

    const formatDate = (dateString, fmt = 'dd-MM-yyyy') => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), fmt);
        } catch (e) {
            return dateString;
        }
    };

    const formatValue = (value, unit = '') => {
        return (value !== null && value !== undefined) ? `${value}${unit}` : '-';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const item = await heatPumpService.getHeatPumpById(id);
                
                setPomp(item);
                
                // Process chart data: format time for X-axis
                const processedData = (item.warmtepompData || []).map(d => ({
                    ...d,
                    tijd: d.original_timestamp 
                        ? format(new Date(d.original_timestamp), 'HH:mm') // Format as 14:30
                        : d.datum,
                    temperatuur: d.temperatuur ?? null,
                    druk: d.druk ?? null
                }));

                setCurrentChartData(processedData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchData();
    }, [id]);

    const pompStatus = (status) => {
        if (status == 300) {
            return {
                style: "border border-yellow-500 bg-yellow-200",
                text: "Onderhoud"
            };
        } else if (status == 500) {
            return {
                style: "border border-red-500 bg-red-200",
                text: "Storing"
            };
        } else {
            return {
                style: "bg-white",
                text: "Actief"
            };
        }
    }

    if (loading) {
        return (
            <>
                <div className='flex flex-wrap items-center justify-between gap-y-3 gap-x-2 mb-4'>
                    <Link to={"/"} className="p-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors">Terug naar overzicht</Link>
                </div>

                <div className="w-full bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Prestaties (Laatste 24 uur)</h3>
                    <div className="w-full" style={{ height: 400 }}>
                        <LineChart
                            dataset={currentChartData}
                            xAxis={[{ 
                                scaleType: 'point', 
                                dataKey: 'tijd', 
                                label: 'Tijdstip' 
                            }]}
                            series={[
                                { 
                                    dataKey: 'temperatuur', 
                                    label: 'Temperatuur (°C)', 
                                    yAxisKey: 'tempAxis', 
                                    color: '#ef4444', 
                                    showMark: false 
                                },
                                { 
                                    dataKey: 'druk', 
                                    label: 'Waterdruk (Bar)', 
                                    yAxisKey: 'pressureAxis', 
                                    color: '#3b82f6', 
                                    showMark: false 
                                }
                            ]}
                            yAxis={[
                                { 
                                    id: 'tempAxis', 
                                    label: 'Temperatuur (°C)',
                                    min: 0,
                                    max: 80 
                                },
                                { 
                                    id: 'pressureAxis', 
                                    label: 'Druk (Bar)', 
                                    position: 'right',
                                    min: 0,
                                    max: 3  
                                }
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                            margin={{ left: 50, right: 50, top: 20, bottom: 40 }}
                        />
                    </div>
                </div>

                <div className='flex flex-col md:flex-row justify-between items-start gap-4'>
                    <div className='w-full md:w-2/3 border border-gray-200 rounded-lg'>
                        <div className="p-5">
                            <ul>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p className="break-all"><span className='font-semibold'>ID: </span>{pomp.id}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Fabrikant: </span>{formatValue(pomp.fabrikant)}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Postcode: </span>{formatValue(pomp.postcode)}</p>
                                    </div>
                                </li>
                                <hr />
                                <li>
                                    <table className='w-full'>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className='flex items-center py-3'>
                                                        <p>
                                                            <span className='font-semibold'>Huidige temperatuur: </span>
                                                            {formatValue(pomp.huidigeTemperatuur, '°C')}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='flex items-center py-3'>
                                                        <p>
                                                            <span className='font-semibold'>Druk: </span>
                                                            {formatValue(pomp.gemiddeldeDruk, ' bar')}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className='flex items-center py-3'>
                                                        <p>
                                                            <span className='font-semibold'>Vermogen: </span>
                                                            {formatValue(pomp.vermogen, ' kW')}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='flex items-center py-3'>
                                                        <p>
                                                            <span className='font-semibold'>Laatste data-update: </span>
                                                            {formatDate(pomp.laatsteDataUpdate, 'dd-MM-yyyy HH:mm')}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </li>
                                <hr />
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Merk: </span>{formatValue(pomp.merk)}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Serienummer: </span>{formatValue(pomp.serienummer)}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Onderhoudsdatum: </span>{formatDate(pomp.onderhoudsdatum)}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Datum van installatie: </span>{formatDate(pomp.installatieDatum)}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='w-full md:w-1/3 border border-gray-200 rounded-lg'>
                        <div className={'p-5 rounded-t-lg ' + pompStatus(pomp.huidigeStatus).style}>
                            <span className='font-semibold'>{pompStatus(pomp.huidigeStatus).text}</span>
                        </div>
                        <hr />
                        <div className="p-5">
                            <ul>
                                {pomp.logs && pomp.logs.length > 0 ? (
                                    pomp.logs.map((log, index) => (
                                        <li key={index}>
                                            <div className='p-3'>
                                                <div className="flex justify-between">
                                                    <span className='font-semibold'>{formatDate(log.date)}</span>
                                                    <span className={`text-xs px-2 py-1 rounded ${log.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-700">
                                                    <span className="font-bold">{log.code}:</span> {log.message}
                                                </p>
                                            </div>
                                            <hr />
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-3 text-gray-500 italic">Geen storingen gevonden.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div className="flex justify-between items-start">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }
}

export default Details
