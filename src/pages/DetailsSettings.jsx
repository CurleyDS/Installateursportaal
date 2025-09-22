import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Calendar } from '../components/CalendarComponent';

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
                <div className='flex items-center justify-start w-full'>
                    <Link to={"/" + pomp.id} className="p-3 rounded-lg">Terug</Link>
                </div>
                <div className='flex items-center justify-start w-full'>
                    <div className='w-full p-3'>
                        <form>
                            <div>
                                <label className="inline-flex items-center cursor-pointer">
                                    <span className="me-3">Automatisch optimaliseren inschakelen</span>
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div>
                                <label htmlFor="profile-range" className="block mb-2">
                                    <span className="mb-3">Profiel selecteren:</span>
                                    <input id="profile-range" type="range" min="0" max="5" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                </label>
                            </div>

                            <div>
                                <label className="inline-flex items-center cursor-pointer">
                                    <span className="me-3">Deelname aan netoptimalisatie</span>
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div>
                                <label htmlFor="cap-range" className="block mb-2">
                                    <span className="mb-3">Sta power-capping toe tot __% tijdens netpieken:</span>
                                    <input id="cap-range" type="range" min="0" max="5" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                </label>
                            </div>
                            
                            <div>
                                <label>Huidige temperatuur:</label>
                                <input type="number" name="number" id="number" />
                            </div>
                            
                            <div>
                                <label className="inline-flex items-center cursor-pointer">
                                    <span className="me-3">Tijdschema's instellen</span>
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                </label>

                                <Calendar />
                            </div>

                            <div>
                                <label htmlFor="save-submit" className="block mb-2">Instellingen opslaan:</label>
                                <input id="save-submit" type="submit" className="p-2 bg-gray-200 rounded-lg cursor-pointer" value="Opslaan" />
                            </div>
                        </form>
                        
                        <form>
                            <div>
                                <label htmlFor="reset-submit" className="block mb-2">Reset warmtepomp:</label>
                                <input id="reset-submit" type="submit" className="p-2 bg-gray-200 rounded-lg cursor-pointer" value="Reset" />
                            </div>
                        </form>
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

export default DetailsSettings
