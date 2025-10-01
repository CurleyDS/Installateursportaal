import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Calendar } from '../components/CalendarComponent';

function DetailsSettings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // is a string. if it needs to be a number, convert it using Number(id)
    const [pomp, setPomp] = useState({});
    const [currentSettings, setCurrentSettings] = useState({});

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
                setCurrentSettings(item.settings);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <>
                <div className='flex items-center justify-start'>
                    <Link to={"/" + pomp.id} className="p-2 bg-gray-200 rounded-lg">Terug</Link>
                </div>
                <div className='flex flex-col items-start'>
                    <form method='POST'>
                        <fieldset className="p-2">
                            <label className="inline-flex items-center">
                                <span className="me-3">Automatisch optimaliseren inschakelen</span>
                                <input type="checkbox" defaultChecked={currentSettings.autoOptimalisatie} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>

                        <fieldset className="p-2">
                            <label htmlFor="profile-range">
                                <span className="mb-3">Profiel selecteren:</span>
                                <input id="profile-range" type="range" defaultValue={currentSettings.profiel} min="0" max="5" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                            </label>
                        </fieldset>

                        <fieldset className="p-2">
                            <label className="inline-flex items-center">
                                <span className="me-3">Deelname aan netoptimalisatie</span>
                                <input type="checkbox" defaultChecked={currentSettings.netOptimalisatie} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>
                        
                        <fieldset className="p-2">
                            <label htmlFor="cap-range">
                                <span className="mb-3">Sta power-capping toe tot {currentSettings.powerCap}% tijdens netpieken:</span>
                                <input id="cap-range" type="range" defaultValue={currentSettings.powerCap} min="0" max="100" step="25" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                            </label>
                        </fieldset>
                        
                        <fieldset className="p-2">
                            <label htmlFor="number" className='block mb-2'>Huidige temperatuur:</label>
                            <input id="number" type="number" defaultValue={currentSettings.temperatuur} min="0" className="p-2 bg-gray-200 rounded-lg cursor-pointer" />
                        </fieldset>
                        
                        <fieldset className="p-2">
                            <label className="inline-flex items-center">
                                <span className="me-3">Tijdschema's instellen</span>
                                <input type="checkbox" defaultValue={currentSettings.tijdschemaInstelling} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>

                        <Calendar data={currentSettings.tijdschemas} />

                        <fieldset className="p-2">
                            <label htmlFor="save-submit" className='block mb-2'>
                                <span className="block mb-2">Instellingen opslaan:</span>
                                <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => openModal()}>Opslaan</button>
                            </label>
                        </fieldset>
                    </form>
                    
                    <form method='POST'>
                        <fieldset className="p-2">
                            <label htmlFor="reset-submit" className='block mb-2'>
                                <span className="block mb-2">Reset warmtepomp:</span>
                                <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => openModal()}>Reset</button>
                            </label>
                        </fieldset>
                    </form>
                </div>
                {/* Modal */}
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

export default DetailsSettings
