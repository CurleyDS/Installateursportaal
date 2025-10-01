import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

function Calendar({ data = [] }) {
    const [tijdschemas, setTijdschemas] = useState(data);
    const [current, setCurrent] = useState(new Date());
    const [selected, setSelected] = useState(null);
    const [minTime, setMinTime] = useState(null);
    const [newSchema, setNewSchema] = useState({});

    const year = current.getFullYear();
    const month = current.getMonth();

    const startOffset = new Date(year, month, 0).getDay(); // 0 (Mon) - 6 (Sun)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    // Empty calendar before month start
    for (let i = 0; i < startOffset; i++) {
        calendar.push(null);
    }
    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        calendar.push(date);
    }
    // Pad to fill table rows (weeks)
    while (calendar.length % 7 !== 0) {
        calendar.push(null);
    }

    const pad = (n) => String(n).padStart(2, "0");

    const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const navigateMonth = (delta) => {
        setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    }

    const handleSelect = (event, date) => {
        event.preventDefault();
        setSelected(ymd(date));
    }

    const openModal = () => {
        document.getElementById("tijdschemaModal").classList.remove('hidden');
    }

    const closeModal = () => {
        document.getElementById("tijdschemaModal").classList.add('hidden');
    }

    useEffect(() => {
        let calculatedMinTime = "00:00";
        let calculatedDefaultTime = "08:00";

        if (selected && selected <= ymd(current)) {
            calculatedMinTime = `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}`;
            calculatedDefaultTime = `${String(current.getHours() + 1).padStart(2, "0")}:00`;
        }

        setMinTime(calculatedMinTime);

        setNewSchema({
            date: selected,
            time: calculatedDefaultTime,
            modus: "normaal",
            onRepeat: false,
            repeat: {
                timePeriod: "day",
                quantity: 1
            }
        });
    }, [selected]);

    window.onclick = function(event) {
        if (event.target == document.getElementById("tijdschemaModal")) {
            document.getElementById("tijdschemaModal").classList.add('hidden');
        }
    }

    return (
        <>
            <fieldset className="p-2">
                <div className="flex flex-col items-center bg-gray-100 p-2 rounded-lg mb-2">
                    <div className="flex items-center justify-between w-full">
                        <button type="button" onClick={() => navigateMonth(-1)} className="rounded"><FontAwesomeIcon icon={faAngleLeft} /></button>
                        
                        <span className="font-bold">{current.toLocaleString("default", { month: "long" }) /* month-name */} {year}</span>
                        
                        <button type="button" onClick={() => navigateMonth(1)} className="rounded"><FontAwesomeIcon icon={faAngleRight} /></button>
                    </div>

                    <table className="bg-gray-100 p-2 w-full">
                        <thead>
                            <tr>
                                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (
                                    <th key={day}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: calendar.length / 7 }).map((_, week) => (
                                <tr key={week}>
                                    {calendar.slice(week * 7, week * 7 + 7).map((date, i) => {
                                        if (!date) {
                                            return <td key={i} className="p-2" />;
                                        } else {
                                            return (
                                                <td key={i} className="p-1 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleSelect(e, date)}
                                                        className={`w-full rounded transition-colors duration-150 ${(selected === ymd(date)) ? "bg-gray-500 text-white" : ((ymd(date) === ymd(new Date())) ? "bg-gray-200 border border-gray-500" : "bg-gray-200 border border-transparent hover:bg-gray-300")}`}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => openModal()} disabled={selected == null}>Tijdschema's toevoegen</button>
                </div>
            </fieldset>
            
            <fieldset className="p-2">
                <label htmlFor="save-submit" className='block mb-2'>
                    <span className="block mb-2">Instellingen opslaan:</span>
                    <button type="button" className="p-2 bg-gray-200 rounded-lg" onClick={() => openModal()}>Opslaan</button>
                </label>
            </fieldset>

            <div id="tijdschemaModal" className="fixed top-0 left-0 z-10 hidden w-full h-full overflow-auto bg-black/40">
                <div className="flex items-center justify-center w-full">
                    <div className="bg-white p-2 rounded">
                        <fieldset className="mb-2">
                            <legend className='block mb-2'>Schakel modus op:</legend>
                            <input type="date" defaultValue={newSchema.date} className="p-2 bg-gray-200 rounded-lg cursor-pointer" /> om <input type="time" defaultValue={newSchema.time} min={minTime} className="p-2 bg-gray-200 rounded-lg cursor-pointer" />
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <label htmlFor="modus-select" className="block mb-2">Naar:</label>
                            <select id="modus-select" className="w-full p-2 bg-gray-200 rounded-lg cursor-pointer">
                                <option value="Normaal">Normaal</option>
                                <option value="Eco">Eco</option>
                            </select>
                        </fieldset>

                        <fieldset className="mb-2">
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="me-3">Herhalen</span>
                                <input type="checkbox" defaultChecked={newSchema.onRepeat} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <input type="radio" name="repeat-radio" />
                            <label htmlFor="day" className="mb-2">
                                <span className="ms-1">Elke <input id="day" type="number" min="1" className="border-b" /> dag herhalen</span>
                            </label>
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <input type="radio" name="repeat-radio" />
                            <label htmlFor="week" className="mb-2">
                                <span className="ms-1">Elke <input id="week" type="number" min="1" className="border-b" /> week herhalen</span>
                            </label>
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <input type="radio" name="repeat-radio" />
                            <label htmlFor="month" className="mb-2">
                                <span className="ms-1">Elke <input id="month" type="number" min="1" className="border-b" /> maand herhalen</span>
                            </label>
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <input type="radio" name="repeat-radio" />
                            <label htmlFor="year" className="mb-2">
                                <span className="ms-1">Elk <input id="year" type="number" min="1" className="border-b" /> jaar herhalen</span>
                            </label>
                        </fieldset>

                        <fieldset className="mb-2">
                            <button type="button" onClick={() => closeModal()}>Annuleren</button>
                            <button type="button" onClick={() => closeModal()}>Opslaan</button>
                        </fieldset>
                    </div>
                </div>
            </div>
        </>
    );
}

export { Calendar };