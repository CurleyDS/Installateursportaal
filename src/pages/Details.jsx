import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { LineChart } from '@mui/x-charts/LineChart';

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

function Details() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // is a string. if it needs to be a number, convert it using Number(id)
    const [pomp, setPomp] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            fetch('/data.json')
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
                setLoading(true);
            })
            .catch((error) => {
                setError(error);
                setLoading(true);
            });
        }

        fetchData();
    }, []);

    // { data: [160, 160, 165, 155, 162, 167, 159, 164, 166, 167, 167, 165, 163, 160, 159, 158, 161, 163, 165, 164, 163, 162, 161, 161, 165, 155] }
    // { data: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 29, 30, 31] }

    return (
        <>
            <div>
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
            </div>
            <div className='w-screen'>
                <div className='p-3 w-3/5 border border-gray-200 rounded-lg'>
                    <div className='p-5'>
                        <ul role='list'>
                            <li className='py-3'>
                                <div className='flex items-center'>
                                    <p><span className='font-semibold'>ID: </span>{pomp.id}</p>
                                </div>
                            </li>
                            <li className='py-3'>
                                <div className='flex items-center'>
                                    <p><span className='font-semibold'>Fabrikant: </span>{pomp.fabrikant}</p>
                                </div>
                            </li>
                            <li className='py-3'>
                                <div className='flex items-center'>
                                    <p><span className='font-semibold'>Postcode: </span>{pomp.postcode}</p>
                                </div>
                            </li>
                            <hr />
                            <li className='py-3'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className='flex items-center'>
                                                    <span className='font-semibold'>Huidige temperatuur: </span>{pomp.huidigeTemperatuur}
                                                </div>
                                            </td>
                                            <td>
                                                <div className='flex items-center'>
                                                    <span className='font-semibold'>Druk: </span>{pomp.gemiddeldeDruk}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className='flex items-center'>
                                                    <span className='font-semibold'>Vermogen: </span>{pomp.vermogen}
                                                </div>
                                            </td>
                                            <td>
                                                <div className='flex items-center'>
                                                    <span className='font-semibold'>Laatste data-update: </span>{pomp.laatsteDataUpdate}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </li>
                            <hr />
                            <li className='py-3'>
                                <div className='flex items-center'>
                                    <p><span className='font-semibold'>Merk: </span>{pomp.merk}</p>
                                </div>
                            </li>
                            <li className='py-3'>
                                <div className='flex items-center'>
                                    <p><span className='font-semibold'>Serienummer: </span>{pomp.serienummer}</p>
                                </div>
                            </li>
                            <li className='py-3'>
                                <div className='flex items-center'>
                                    <p><span className='font-semibold'>Onderhoudsdatum: </span>{pomp.onderhoudsdatum}</p>
                                </div>
                            </li>
                            <li className='py-3'>
                                <div className='flex items-center'>
                                    <p><span className='font-semibold'>Datum van installatie: </span>{pomp.installatieDatum}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='w-2/5'>
                    {/* event log */}
                </div>
            </div>
        </>
    )
}

export default Details
