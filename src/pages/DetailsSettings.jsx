import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

function DetailsSettings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // is a string. if it needs to be a number, convert it using Number(id)
    const [pomp, setPomp] = useState({});

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
                setLoading(true);
            })
            .catch((error) => {
                setError(error);
                setLoading(true);
            });
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <>
                {/* Instellingen */}
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

export default DetailsSettings
