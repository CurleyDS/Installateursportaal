import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

// const pompData = [
//       { x: 1, y: 160 }, { x: 2, y: 160 }, { x: 3, y: 165 },
//       { x: 4, y: 155 }, { x: 5, y: 162 }, { x: 6, y: 167 },
//       { x: 7, y: 164 }, { x: 8, y: 162 }, { x: 9, y: 159 },
//       { x: 10, y: 164 }, { x: 11, y: 166 }, { x: 12, y: 167 },
//       { x: 13, y: 167 }, { x: 14, y: 165 }, { x: 15, y: 163 },
//       { x: 16, y: 160 }, { x: 17, y: 159 }, { x: 18, y: 158 },
//       { x: 19, y: 161 }, { x: 20, y: 163 }, { x: 21, y: 165 },
//       { x: 22, y: 165 }, { x: 23, y: 164 }, { x: 24, y: 164 },
//       { x: 25, y: 163 }, { x: 26, y: 162 }, { x: 27, y: 161 },
//       { x: 28, y: 161 }, { x: 29, y: 161 }, { x: 30, y: 165 },
//       { x: 31, y: 155 }
// ];


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
        },
        temperatuur: {
            type: "line",
            label: "Temperatuur (°C)",
            accessor: (item) => item.temperatuur,
            xAxisKey: "x-point",
        },
        druk: {
            type: "line",
            label: "Druk (bar)",
            accessor: (item) => item.druk,
            xAxisKey: "x-point",
        },
        vermogen: {
            type: "line",
            label: "Vermogen (kW)",
            accessor: (item) => item.vermogen,
            xAxisKey: "x-point",
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            fetch('/dummy-data.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const item = data.heatpumps.find((item) => item.id === Number(id));
                if (!item) {
                    throw new Error('Item not found');
                }
                return item;
            })
            .then((item) => {
                setPomp(item);
                setCurrentChartData(item.warmtepompData);
                setLoading(true);
            })
            .catch((error) => {
                setError(error);
                setLoading(true);
            });
        }

        fetchData();
    }, []);

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
                <div>
                    <div>
                        <div className='flex items-center justify-between w-full'>
                            <div className='p-3'>
                                <Link to={"/"}>
                                    <span className="rounded-lg ml-3">Terug</span>
                                </Link>
                            </div>
                            <div className='p-3'>
                                <span className="rounded-lg ml-3">Dag naar Maand knop</span>
                            </div>
                            <div className='relative p-3'>
                                <span className="rounded-lg ml-3" onClick={() => toggleDropdown('dropdownChart')}>Chart</span>

                                <div id="dropdownChart" className="absolute top-8 right-0 z-10 hidden bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li onClick={() => selectFilter("status")}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Status Filter</span>
                                        </li>
                                        <li onClick={() => selectFilter("temperatuur")}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Temperatuur Filter</span>
                                        </li>
                                        <li onClick={() => selectFilter("druk")}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Druk Filter</span>
                                        </li>
                                        <li onClick={() => selectFilter("vermogen")}>
                                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Vermogen Filter</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
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
                                scaleType: "band",
                                label: "Dag",
                                tickPlacement: "start",
                                tickLabelPlacement: "tick",
                            },
                            {
                                id: "x-point",
                                data: Array.from({ length: 30 }, (_, i) => i + 1),
                                scaleType: "point",
                                position: "none", // hidden axis
                            },
                        ]}
                        yAxis={[{ id: "y-axis-id" }]}
                        height={300}
                    >
                        {chartConfig[selectedFilter].type === "bar" && <BarPlot />}
                        {chartConfig[selectedFilter].type === "line" && <LinePlot />}
                        {chartConfig[selectedFilter].type === "line" && <MarkPlot />}
                        <ChartsYAxis label={chartConfig[selectedFilter].label} axisId="y-axis-id" />
                        <ChartsXAxis label="Dag" axisId="x-band" />
                    </ChartContainer>
                </div>
                <div className='flex flex-row justify-between items-start w-full gap-4'>
                    <div className='w-3/5 border border-gray-200 rounded-lg'>
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
                    <div className='w-2/5 border border-gray-200 rounded-lg'>
                        <div className={'p-5 rounded-t-lg ' + pompStatus(pomp.huidigeStatus).style}>
                            <p>
                                <span className='font-semibold'>{pompStatus(pomp.huidigeStatus).text}</span>
                            </p>
                        </div>
                        <hr />
                        <div className="p-5">
                            <ul>
                                {pomp.logs && pomp.logs.map((log, index) => (
                                    <li key={index}>
                                        <div className='flex items-center py-3'>
                                            <span>
                                                <p><span className='font-semibold'>{log.datum}: </span></p>
                                                <ul className='list-disc'>
                                                    {log.acties && log.acties.map((actie, actieIndex) => (
                                                        <li key={actieIndex}>{actie.title}. {actie.beschrijving}</li>
                                                    ))}
                                                </ul>
                                            </span>
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
            <div className="flex justify-between items-start w-full">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }
}

export default Details
