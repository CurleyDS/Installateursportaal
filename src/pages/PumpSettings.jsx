import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { heatPumpService } from '../services/heatPumpService';
import { Calendar } from '../components/CalendarComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function PumpSettings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [pomp, setPomp] = useState({});
    const [currentSettings, setCurrentSettings] = useState({});
    const [settings, setSettings] = useState({});
    const [modal, setModal] = useState(0);
    const [submitModal, setSubmitModal] = useState(false);
    const [demoMode, setDemoMode] = useState(localStorage.getItem('useDemoMode') === 'true');

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setSettings((oldSettings) => ({
            ...oldSettings,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    const handleCalendarUpdate = (newTijdschemas) => {
        setSettings((oldSettings) => ({
            ...oldSettings,
            tijdschemas: newTijdschemas
        }));
    };

    const openModal = (saveOrReset) => {
        document.getElementById("confirmModal").classList.remove('hidden');

        setModal(saveOrReset);
    }
    
    const submitSettings = async () => {
        try {
            await heatPumpService.updateSettings(id, settings);
            setSubmitModal(true);
        } catch (err) {
            console.error(err);
            // Optionally set error state here
        }
    }

    const closeModal = () => {
        document.getElementById("confirmModal").classList.add('hidden');
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const item = await heatPumpService.getHeatPumpById(id);
                
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
                {/* Back button */}
                <div className='flex items-center justify-between mb-4'>
                    <Link to={"/" + pomp.id} className="p-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors">Terug</Link>
                </div>

                {/* Main card */}
                <div className='w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6'>
                    <h2 className="text-lg font-semibold text-gray-800 mb-6"> Warmtepomp instellingen</h2>

                    <form method='POST' className='space-y-4'>
                        <fieldset>
                            <label className="flex items-center justify-between gap-4">
                                <span className="text-gray-700">Automatisch optimaliseren inschakelen</span>
                                <input type="checkbox" name="autoOptimalisatie" defaultChecked={currentSettings.autoOptimalisatie} onChange={handleChange} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                        </fieldset>

                        <fieldset>
                            <label className="block text-gray-700 mb-1">Profiel selecteren</label>
                            <input type="range" name="profiel" defaultValue={currentSettings.profiel} onChange={handleChange} min="0" max="5" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none" />
                        </fieldset>

                        <fieldset>
                            <label className="flex items-center justify-between gap-4">
                                <span className="text-gray-700">Deelname aan netoptimalisatie</span>
                                <input type="checkbox" name="netOptimalisatie" defaultChecked={currentSettings.netOptimalisatie} onChange={handleChange} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                        </fieldset>
                        
                        <fieldset>
                            <label className="block text-gray-700 mb-1">Sta power-capping toe tot {currentSettings.powerCap}%</label>
                            <input type="range" name="powerCap" defaultValue={currentSettings.powerCap} onChange={handleChange} min="0" max="100" step="25" className="w-full h-2 bg-gray-200 rounded-lg appearance-none" />
                        </fieldset>
                        
                        <fieldset>
                            <label className='block text-gray-700 mb-1'>Huidige temperatuur</label>
                            <input type="number" name="temperatuur" defaultValue={currentSettings.temperatuur} onChange={handleChange} min="0" className="p-2 bg-gray-100 border border-gray-300 rounded-lg w-full" />
                        </fieldset>
                        
                        <fieldset>
                            <label className="flex items-center justify-between gap-4">
                                <span className="text-gray-700">Tijdschema's instellen</span>
                                <input type="checkbox" name="tijdschemaInstelling" defaultValue={currentSettings.tijdschemaInstelling} onChange={handleChange} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                        </fieldset>

                        <Calendar tijdschemaInstelling={settings.tijdschemaInstelling} tijdschemas={currentSettings.tijdschemas} onUpdate={handleCalendarUpdate} />

                        <div className="flex gap-2 pt-4">
                            <button type="button" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors" onClick={() => openModal(0)}>Opslaan</button>
                            <button type="button" className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" onClick={() => openModal(1)}>Reset</button>
                        </div>
                    </form>

                    {/* Developer Settings */}
                    <div className="w-full mt-8 border-t border-gray-200 pt-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Ontwikkelaars Instellingen</h2>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-yellow-900">Demo Modus</h3>
                                    <p className="text-sm text-yellow-700">Gebruik dummy data om de interface te testen.</p>
                                </div>
                                <label className="flex items-center justify-between gap-4 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={demoMode} 
                                        onChange={(e) => {
                                            const newVal = e.target.checked;
                                            setDemoMode(newVal);
                                            localStorage.setItem('useDemoMode', newVal);
                                            // Force reload to switch data source
                                            window.location.reload();
                                        }} 
                                        className="sr-only peer" 
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="confirmModal" className="fixed top-0 left-0 z-10 hidden bg-black/40 w-full h-full overflow-auto">
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col items-center justify-center bg-white p-2 w-1/2">
                            {!submitModal ? (
                                <>
                                    <span className="self-center text-xl font-semibold">{modal == 0 ? "Wilt u uw instellingen opslaan?" : "Weet u zeker dat u de warmtepomp wilt resetten?"}</span>

                                    <fieldset className="flex items-center justify-between p-2 w-full">
                                        <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => closeModal()}>Annuleren</button>
                                        <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => submitSettings()}>{modal == 0 ? "Opslaan" : "Reset"}</button>
                                    </fieldset>
                                </>
                            ) : (
                                <>
                                    <span className="self-center text-xl font-semibold">{modal == 0 ? "Instellingen opgeslagen!" : "Warmtepomp reset!"}</span>

                                    <button type="submit" onClick={() => {setSubmitModal(false); closeModal()}}><FontAwesomeIcon icon={faCircleCheck} className="p-2 text-9xl" /></button>
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

export default PumpSettings
