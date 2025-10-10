import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Calendar } from '../components/CalendarComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function DetailsSettings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // is a string. if it needs to be a number, convert it using Number(id)
    const [pomp, setPomp] = useState({});
    const [currentSettings, setCurrentSettings] = useState({});
    const [settings, setSettings] = useState({});
    const [modal, setModal] = useState(0);
    const [submitModal, setSubmitModal] = useState(false);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setSettings((oldSettings) => ({
            ...oldSettings,
            [name]: type === 'checkbox' ? checked : value
        }));
    }
    const openModal = (saveOrReset) => {
        document.getElementById("confirmModal").classList.remove('hidden');

        setModal(saveOrReset);
    }

    const closeModal = () => {
        document.getElementById("confirmModal").classList.add('hidden');
    }

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
                setSettings(item.settings);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchData();
    }, [id]);

    window.onclick = function(event) {
        if (event.target == document.getElementById("confirmModal")) {
            document.getElementById("confirmModal").classList.add('hidden');
        }
    }

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
                                <input type="checkbox" name="autoOptimalisatie" defaultChecked={currentSettings.autoOptimalisatie} onChange={handleChange} className="sr-only peer" />
                                <div className="relative bg-gray-200 w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>

                        <fieldset className="p-2">
                            <label htmlFor="profile-range">
                                <span className="mb-3">Profiel selecteren:</span>
                                <input id="profile-range" type="range" name="profiel" defaultValue={currentSettings.profiel} onChange={handleChange} min="0" max="5" step="1" className="bg-gray-200 w-full h-2 appearance-none rounded-lg" />
                            </label>
                        </fieldset>

                        <fieldset className="p-2">
                            <label className="inline-flex items-center">
                                <span className="me-3">Deelname aan netoptimalisatie</span>
                                <input type="checkbox" name="netOptimalisatie" defaultChecked={currentSettings.netOptimalisatie} onChange={handleChange} className="sr-only peer" />
                                <div className="relative bg-gray-200 w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>
                        
                        <fieldset className="p-2">
                            <label htmlFor="cap-range">
                                <span className="mb-3">Sta power-capping toe tot {currentSettings.powerCap}% tijdens netpieken:</span>
                                <input id="cap-range" type="range" name="powerCap" defaultValue={currentSettings.powerCap} onChange={handleChange} min="0" max="100" step="25" className="bg-gray-200 w-full h-2 appearance-none rounded-lg" />
                            </label>
                        </fieldset>
                        
                        <fieldset className="p-2">
                            <label htmlFor="number" className='block mb-2'>Huidige temperatuur:</label>
                            <input id="number" type="number" name="temperatuur" defaultValue={currentSettings.temperatuur} onChange={handleChange} min="0" className="p-2 bg-gray-200 rounded-lg" />
                        </fieldset>
                        
                        <fieldset className="p-2">
                            <label className="inline-flex items-center">
                                <span className="me-3">Tijdschema's instellen</span>
                                <input type="checkbox" name="tijdschemaInstelling" defaultValue={currentSettings.tijdschemaInstelling} onChange={handleChange} className="sr-only peer" />
                                <div className="relative bg-gray-200 w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>

                        <Calendar data={currentSettings.tijdschemas} />

                        <fieldset className="p-2">
                            <label htmlFor="save-submit" className='block mb-2'>
                                <span className="block mb-2">Instellingen opslaan:</span>
                                <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => {console.log(settings); openModal(0)}}>Opslaan</button>
                            </label>
                        </fieldset>
                    </form>
                    
                    <form method='POST'>
                        <fieldset className="p-2">
                            <label htmlFor="reset-submit" className='block mb-2'>
                                <span className="block mb-2">Reset warmtepomp:</span>
                                <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => openModal(1)}>Reset</button>
                            </label>
                        </fieldset>
                    </form>
                </div>
                <div id="confirmModal" className="fixed top-0 left-0 z-10 hidden bg-black/40 w-full h-full overflow-auto">
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col items-center justify-center bg-white p-2 w-1/2">
                            {submitModal ? (
                                <>
                                    <span className="self-center text-xl font-semibold">{modal == 0 ? "Wilt u uw instellingen opslaan?" : "Weet u zeker dat u de warmtepomp wilt resetten?"}</span>

                                    <fieldset className="flex items-center justify-between p-2 w-full">
                                        <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => closeModal()}>Annuleren</button>
                                        <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => setSubmitModal(true)}>{modal == 0 ? "Opslaan" : "Reset"}</button>
                                    </fieldset>
                                </>
                            ) : (
                                <>
                                    <span className="self-center text-xl font-semibold">{modal == 0 ? "Instellingen opgeslagen!" : "Warmtepomp reset!"}</span>

                                    <button type="submit" className="p-2"><FontAwesomeIcon icon={faCircleCheck} className="text-9xl p-2" /></button>
                                </>
                            )}
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

export default DetailsSettings
