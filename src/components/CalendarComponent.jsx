import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

function Calendar({ initialDate = new Date() }) {
    const [current, setCurrent] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [selected, setSelected] = useState(null);

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

    window.onclick = function(event) {
        if (event.target == document.getElementById("tijdschemaModal")) {
            document.getElementById("tijdschemaModal").classList.add('hidden');
        }
    }

    return (
        <div className="mb-2">
            <div className="p-2 bg-gray-100 rounded-lg mb-2">
                <div className="flex items-center justify-between p-2">
                    <button type="button" onClick={() => navigateMonth(-1)} className="rounded"><FontAwesomeIcon icon={faAngleLeft} /></button>
                    
                    <h2 className="font-bold">{current.toLocaleString("default", { month: "long" }) /* month-name */} {year}</h2>
                    
                    <button type="button" onClick={() => navigateMonth(1)} className="rounded"><FontAwesomeIcon icon={faAngleRight} /></button>
                </div>

                <table className="w-full">
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
                <button type="button" className="p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => openModal()} disabled={selected == null}>Tijdschema's toevoegen</button>
            </div>

            <div id="tijdschemaModal" className="fixed top-0 left-0 z-10 hidden w-full h-full overflow-auto bg-black/40">
                <div className="bg-white mx-auto p-2 rounded w-1/2">
                    <div>
                        <label className="block mb-2">
                            <span className="mb-3">Schakel modus op:</span>
                            <input type="date" /> om <input type="time" />
                        </label>
                    </div>
                    
                    <div>
                        <label htmlFor="modus-select" className="block mb-2">
                            <span className="mb-3">Naar:</span>
                            <select id="modus-select">
                                <option value="Normaal">Normaal</option>
                                <option value="Eco">Eco</option>
                            </select>
                        </label>
                    </div>

                    <div>
                        <label className="inline-flex items-center cursor-pointer">
                            <span className="me-3">Herhalen</span>
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    
                    <div>
                        <label>
                            <span className="me-3">Elke dag herhalen</span>
                            <input type="radio" name="repeat-radio" value="" />
                        </label>
                    </div>
                    
                    <div>
                        <label>
                            <span className="me-3">Elke week herhalen</span>
                            <input type="radio" name="repeat-radio" value="" />
                        </label>
                    </div>
                    
                    <div>
                        <label>
                            <span className="me-3">Elke maand herhalen</span>
                            <input type="radio" name="repeat-radio" value="" />
                        </label>
                    </div>
                    
                    <div>
                        <label>
                            <span className="me-3">Elk jaar herhalen</span>
                            <input type="radio" name="repeat-radio" value="" />
                        </label>
                    </div>

                    <div>
                        <button type="button" onClick={() => closeModal()}>Annuleren</button>
                        <button type="button" onClick={() => closeModal()}>Opslaan</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Calendar };