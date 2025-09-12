import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';

function DetailsSettings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // is a string. if it needs to be a number, convert it using Number(id)
    const [pomp, setPomp] = useState({});

    const [current, setCurrent] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [selected, setSelected] = useState(null);

    const year = current.getFullYear();
    const month = current.getMonth();

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
                    <div className='p-3'>
                        <form>
                            <div>
                                <label class="inline-flex items-center cursor-pointer">
                                    <span class="me-3">Automatisch optimaliseren inschakelen</span>
                                    <input type="checkbox" value="" class="sr-only peer" />
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div>
                                <label for="steps-range" class="block mb-2">
                                    <span class="mb-3">Profiel selecteren:</span>
                                    <input id="steps-range" type="range" min="0" max="5" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                </label>
                            </div>

                            <div>
                                <label class="inline-flex items-center cursor-pointer">
                                    <span class="me-3">Deelname aan netoptimalisatie</span>
                                    <input type="checkbox" value="" class="sr-only peer" />
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div>
                                <label for="steps-range" class="block mb-2">
                                    <span class="mb-3">Sta power-capping toe tot __% tijdens netpieken:</span>
                                    <input id="steps-range" type="range" min="0" max="5" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                </label>
                            </div>
                            
                            <div>
                                <label>
                                    <span>Huidige temperatuur:</span>
                                </label>
                            </div>
                            
                            <div>
                                <label class="inline-flex items-center cursor-pointer">
                                    <span class="me-3">Tijdschema's instellen</span>
                                    <input type="checkbox" value="" class="sr-only peer" />
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                </label>

                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="text-gray-600 text-sm">
                                            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => (
                                                <th key={day} className="p-2 font-medium">{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: cells.length / 7 }).map((_, week) => (
                                            <tr key={week}>
                                                {cells.slice(week * 7, week * 7 + 7).map((date, i) => {
                                                    if (!date) return <td key={i} className="p-2" />;
                                                    const key = ymd(date);
                                                    const isToday = key === todayKey;
                                                    const isSelected = selected === key;

                                                    return (
                                                        <td key={i} className="p-1 text-center">
                                                            <button
                                                                onClick={() => setSelected(key)}
                                                                className={`w-10 h-10 rounded-full transition-colors duration-150 ${isSelected ? "bg-indigo-500 text-white" : (isToday ? "border border-indigo-500" : "hover:bg-gray-100")}`}
                                                            >
                                                                {date.getDate()}
                                                            </button>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Monday</th>
                                            <th>Tuesday</th>
                                            <th>Wednesday</th>
                                            <th>Thursday</th>
                                            <th>Friday</th>
                                            <th>Saturday</th>
                                            <th>Sunday</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>2</td>
                                            <td>3</td>
                                            <td>4</td>
                                            <td>5</td>
                                            <td>6</td>
                                            <td>7</td>
                                        </tr>
                                    </tbody>
                                </table>
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
