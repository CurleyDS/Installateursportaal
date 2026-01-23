import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { heatPumpService } from '../services/heatPumpService';
import { LineChart } from '@mui/x-charts/LineChart';
import { format } from 'date-fns';

function Details() {
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [pomp, setPomp] = useState({});
    const [currentChartData, setCurrentChartData] = useState([]);
    const [timeRange, setTimeRange] = useState('24h');

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

    // Fetch initial Pump Details
    useEffect(() => {
        const fetchPumpDetails = async () => {
            try {
                const item = await heatPumpService.getHeatPumpById(id);
                setPomp(item);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }
        fetchPumpDetails();
    }, [id]);

    // Fetch Chart Data when timeRange changes
    useEffect(() => {
        const fetchChartData = async () => {
            setChartLoading(true);
            try {
                const history = await heatPumpService.getHeatPumpHistory(id, timeRange);
                
                // Format X-Axis based on range
                const dateFormat = timeRange === '24h' ? 'HH:mm' : 'dd-MM HH:mm';
                
                const processedData = history.map(d => ({
                    ...d,
                    tijd: d.original_timestamp 
                        ? format(new Date(d.original_timestamp), dateFormat)
                        : d.datum,
                    temperatuur: d.temperatuur ?? null,
                    druk: d.druk ?? null
                }));

                setCurrentChartData(processedData);
            } catch (error) {
                console.error("Chart fetch error:", error);
            } finally {
                setChartLoading(false);
            }
        }

        if (id) fetchChartData();
    }, [id, timeRange]);

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
        const cleanTemp = currentChartData.map(d => parseFloat(d.temperatuur || 0));
        const cleanPressure = currentChartData.map(d => parseFloat(d.druk || 0));
        const cleanLabels = currentChartData.map(d => d.tijd);

        return (
            <>
                <div className='flex flex-wrap items-center justify-between gap-y-3 gap-x-2 mb-4'>
                    <Link to={"/"} className="p-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors">Terug naar overzicht</Link>
                </div>

                <div className="w-full bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Prestaties</h3>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                            {['24h', '7d', '30d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                                        timeRange === range 
                                            ? 'bg-white shadow text-blue-600 font-medium' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {range.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="w-full relative h-[350px] md:h-[450px]">
                        {chartLoading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <span className="text-gray-500">Laden...</span>
                            </div>
                        )}
                        <LineChart
                            autosize
                            series={[
                                {
                                    id: 'temp_series',
                                    data: cleanTemp,
                                    label: 'Temperatuur (°C)',
                                    color: '#ef4444',
                                    yAxisKey: 'leftAxis',
                                    showMark: false,
                                },
                                {
                                    id: 'pressure_series',
                                    data: cleanPressure,
                                    label: 'Waterdruk (Bar)',
                                    color: '#3b82f6',
                                    yAxisKey: 'rightAxis',
                                    showMark: false,
                                },
                            ]}
                            yAxis={[
                                {
                                    id: 'leftAxis',
                                    scaleType: 'linear',
                                    label: 'Temperatuur (°C)',
                                    min: 0,
                                    max: 80,
                                },
                                {
                                    id: 'rightAxis',
                                    scaleType: 'linear',
                                    label: 'Druk (Bar)',
                                    position: 'right',
                                    min: 0, 
                                    max: 4, 
                                },
                            ]}
                            xAxis={[{ scaleType: 'point', data: cleanLabels }]}
                            margin={{ top: 20, right: 50, bottom: 30, left: 50 }}
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
