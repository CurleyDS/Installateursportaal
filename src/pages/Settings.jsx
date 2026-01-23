import { useState } from 'react';

function Settings() {
    const [demoMode, setDemoMode] = useState(localStorage.getItem('useDemoMode') === 'true');

    return (
        <div className="p-6 max-w-4xl mx-auto">
             <h1 className="text-2xl font-bold mb-6 text-gray-900">Instellingen</h1>
             
             {/* Developer Settings */}
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Systeem Instellingen</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-yellow-900">Demo Modus</h3>
                                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-200 text-yellow-800 rounded-full">DEV</span>
                            </div>
                            <p className="text-sm text-yellow-700 mt-1">Gebruik dummy data om de interface te testen zonder backend verbinding.</p>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
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
    );
}

export default Settings;