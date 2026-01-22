import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { heatPumpService } from '../services/heatPumpService';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { format } from 'date-fns';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

function Details() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [selectedFilter, setSelectedFilter] = useState("status");
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

    const chartConfig = {
        status: {
            type: "bar",
            label: "Status (%)",
            accessor: (item) => (item.status === 200 ? 100 : 0),
            xAxisKey: "x-band",
            min: 0,
            max: 100,
            maxInterval: 100,
        },
        temperatuur: {
            type: "line",
            label: "Temperatuur (°C)",
            accessor: (item) => item.temperatuur ?? null,
            xAxisKey: "x-point",
            min: 0,
            max: 30,
            maxInterval: 1,
        },
        druk: {
            type: "line",
            label: "Druk (bar)",
            accessor: (item) => item.druk ?? null,
            xAxisKey: "x-point",
            min: 0,
            max: 2,
            maxInterval: 0.1,
        },
        vermogen: {
            type: "line",
            label: "Vermogen (kW)",
            accessor: (item) => item.vermogen ?? null,
            xAxisKey: "x-point",
            min: 0,
            max: 6,
            maxInterval: 0.1,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const item = await heatPumpService.getHeatPumpById(id);
                
                setPomp(item);
                setCurrentChartData(item.warmtepompData || []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchData();
    }, [id]);

    const toggleDropdown = (dropdownId) => {
        let dropdownFilter = document.getElementById(dropdownId);
        if (dropdownFilter.classList.contains('hidden')) {
            dropdownFilter.classList.remove('hidden');
        } else {
            dropdownFilter.classList.add('hidden');
        }
    }

    const selectFilter = (filter) => {
        setSelectedFilter(filter);
        toggleDropdown("dropdownChart");
    }

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
                <div className='flex items-center justify-between'>
                    <Link to={"/"} className="p-2 bg-gray-200 rounded-lg">Terug</Link>

                    <span className="p-2 bg-gray-200 rounded-lg">Naar dagweergave</span> {/* Nog niet functioneel */}
                    
                    <span className='relative cursor-pointer' onClick={() => toggleDropdown('dropdownChart')}>
                        <span className='p-2 bg-gray-200 rounded-lg'>{selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</span>

                        <div id="dropdownChart" className="absolute top-8 right-0 z-10 hidden bg-white divide-y divide-gray-100 w-44 p-2 rounded-lg">
                            <ul className="py-2">
                                <li onClick={() => selectFilter("status")}>
                                    <span className="block px-4 py-2 hover:bg-gray-100">Status Filter</span>
                                </li>
                                <li onClick={() => selectFilter("temperatuur")}>
                                    <span className="block px-4 py-2 hover:bg-gray-100">Temperatuur Filter</span>
                                </li>
                                <li onClick={() => selectFilter("druk")}>
                                    <span className="block px-4 py-2 hover:bg-gray-100">Druk Filter</span>
                                </li>
                                <li onClick={() => selectFilter("vermogen")}>
                                    <span className="block px-4 py-2 hover:bg-gray-100">Vermogen Filter</span>
                                </li>
                            </ul>
                        </div>
                    </span>
                </div>
                <ChartContainer
                    dataset={currentChartData}
                    series={[
                        {
                            type: chartConfig[selectedFilter].type,
                            data: currentChartData.map(chartConfig[selectedFilter].accessor),
                            label: chartConfig[selectedFilter].label,
                            xAxisKey: chartConfig[selectedFilter].xAxisKey,
                        },
                    ]}
                    xAxis={[
                        {
                            id: chartConfig[selectedFilter].xAxisKey,
                            data: currentChartData.length > 0 ? currentChartData.map(d => d.datum) : ["Geen data"], 
                            scaleType: chartConfig[selectedFilter].type === "bar" ? "band" : "point",
                            label: "Tijdstip",
                        },
                    ]}
                    yAxis={[
                        { 
                            id: "y-axis-id",
                            min: chartConfig[selectedFilter].min,
                            max: chartConfig[selectedFilter].max,
                            maxInterval: chartConfig[selectedFilter].maxInterval,
                        }
                    ]}
                    height={300}
                >
                    {chartConfig[selectedFilter].type === "bar" && <BarPlot />}
                    {chartConfig[selectedFilter].type === "line" && <LinePlot />}
                    {chartConfig[selectedFilter].type === "line" && <MarkPlot />}
                    <ChartsYAxis label={chartConfig[selectedFilter].label} axisId="y-axis-id" />
                    <ChartsXAxis label="Tijdstip" axisId={chartConfig[selectedFilter].xAxisKey} />
                </ChartContainer>
                <div className='flex flex-row justify-between items-start gap-4'>
                    <div className='w-2/3 border border-gray-200 rounded-lg'>
                        <div className="p-5">
                            <ul>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>ID: </span>{pomp.id}</p>
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
                    <div className='w-1/3 border border-gray-200 rounded-lg'>
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
