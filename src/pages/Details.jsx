import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

function Details() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // is a string. if it needs to be a number, convert it using Number(id)
    const [selectedFilter, setSelectedFilter] = useState("status");
    const [pomp, setPomp] = useState({});
    const [currentChartData, setCurrentChartData] = useState([]);

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
            accessor: (item) => item.temperatuur,
            xAxisKey: "x-point",
            min: 0,
            max: 30,
            maxInterval: 1,
        },
        druk: {
            type: "line",
            label: "Druk (bar)",
            accessor: (item) => item.druk,
            xAxisKey: "x-point",
            min: 0,
            max: 2,
            maxInterval: 0.1,
        },
        vermogen: {
            type: "line",
            label: "Vermogen (kW)",
            accessor: (item) => item.vermogen,
            xAxisKey: "x-point",
            min: 0,
            max: 6,
            maxInterval: 0.1,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/dummy-data.json');
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                const item = data.heatpumps.find((item) => item.id === Number(id));

                if (!item) {
                    throw new Error('Item not found');
                }
                
                setPomp(item);
                setCurrentChartData(item.warmtepompData);
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
                            id: "x-band",
                            data: Array.from({ length: 30 }, (_, i) => i + 1), // dagen
                            scaleType: chartConfig[selectedFilter].type === "bar" ? "band" : "point",
                            label: "Dag",
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
                    <ChartsXAxis label="Dag" axisId="x-band" />
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
                                        <p><span className='font-semibold'>Fabrikant: </span>{pomp.fabrikant}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Postcode: </span>{pomp.postcode}</p>
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
                                                            {pomp.huidigeTemperatuur}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='flex items-center py-3'>
                                                        <p>
                                                            <span className='font-semibold'>Druk: </span>
                                                            {pomp.gemiddeldeDruk}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className='flex items-center py-3'>
                                                        <p>
                                                            <span className='font-semibold'>Vermogen: </span>
                                                            {pomp.vermogen}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='flex items-center py-3'>
                                                        <p>
                                                            <span className='font-semibold'>Laatste data-update: </span>
                                                            {pomp.laatsteDataUpdate}
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
                                        <p><span className='font-semibold'>Merk: </span>{pomp.merk}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Serienummer: </span>{pomp.serienummer}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Onderhoudsdatum: </span>{pomp.onderhoudsdatum}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='flex items-center py-3'>
                                        <p><span className='font-semibold'>Datum van installatie: </span>{pomp.installatieDatum}</p>
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
                                {pomp.logs && pomp.logs.map((log, index) => (
                                    <li key={index}>
                                        <div className='p-3'>
                                            <span className='font-semibold'>{log.datum}: </span>
                                            <ul className='list-disc'>
                                                {log.acties && log.acties.map((actie, actieIndex) => (
                                                    <li key={actieIndex}>{actie.title}. {actie.beschrijving}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <hr />
                                    </li>
                                ))}
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
