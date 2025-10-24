import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';

function Calendar({ data = [], onUpdate }) {
    const [tijdschemas, setTijdschemas] = useState(data);
    const [current, setCurrent] = useState(new Date());
    const [selected, setSelected] = useState(null);
    const [minTime, setMinTime] = useState(null);
    const [newSchema, setNewSchema] = useState({});
    const [hasRepInterval, setRepInterval] = useState(null);
    const [hasRepType, setRepType] = useState(null);

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

    const intervalTypes = ["day", "week", "month", "year"];

    const intervalLabels = {
        day: "dag",
        week: "week",
        month: "maand",
        year: "jaar",
    };

    const hasEventOnDate = (checkDate) => {
        return tijdschemas.some((schema) => {
            const schemaDate = new Date(schema.date);

            // 1️⃣ Non-repeating event
            if (!schema.onRepeat) {
                return ymd(schemaDate) === ymd(checkDate);
            }

            // 2️⃣ Repeating event
            let occurrenceDate = new Date(schemaDate);
            let occurrenceIndex = 0;

            while (true) {
                // stop if we've reached duration (for numeric durations)
                if (typeof schema.repeatDuration === "number" && occurrenceIndex >= schema.repeatDuration) break;

                // ✅ match found
                if (ymd(occurrenceDate) === ymd(checkDate)) return true;

                // ⏩ increment date according to interval
                switch (schema.repeatInterval) {
                    case "day":
                        occurrenceDate.setDate(occurrenceDate.getDate() + schema.repeat);
                        break;
                    case "week":
                        occurrenceDate.setDate(occurrenceDate.getDate() + 7 * schema.repeat);
                        break;
                    case "month":
                        occurrenceDate.setMonth(occurrenceDate.getMonth() + schema.repeat);
                        break;
                    case "year":
                        occurrenceDate.setFullYear(occurrenceDate.getFullYear() + schema.repeat);
                        break;
                    default:
                        break;
                }

                occurrenceIndex++;

                // 🛑 safety break (in case of "forever" to avoid infinite loops)
                if (schema.repeatDuration === "forever" && occurrenceIndex > 1000) break;
            }

            return false;
        });
    };

    const repeatTypes = ["forever", "until", "count"];

    const repeatLabels = {
        forever: "Altijd",
        until: "Tot",
        count: "Specifiek",
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        if (name === "repeatInterval") {
            setNewSchema((oldSchema) => ({
                ...oldSchema,
                repeat: 1
            }));

            setRepInterval(true);
            setRepType(value);
        }

        setNewSchema((oldSchema) => ({
            ...oldSchema,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    const openModal = () => {
        document.getElementById("tijdschemaModal").classList.remove('hidden');
    }
    
    const submitCalendar = () => {
        setTijdschemas((oldTijdSchemas) => [...oldTijdSchemas, newSchema]);
    }

    const closeModal = () => {
        document.getElementById("tijdschemaModal").classList.add('hidden');
    }

    useEffect(() => {
        onUpdate(tijdschemas);
    }, [tijdschemas]);

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
            repeat: 1,
            repeatInterval: "day",
            repeatDuration: 1
        });

        setRepInterval(false);
        setRepType("forever");
    }, [selected]);

    window.onclick = function(event) {
        if (event.target == document.getElementById("tijdschemaModal")) {
            document.getElementById("tijdschemaModal").classList.add('hidden');
        }
    }

    return (
        <>
            <fieldset className="p-2">
                <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg mb-2">
                    <div className="flex items-center justify-between p-2 w-full">
                        <button type="button" onClick={() => navigateMonth(-1)}><FontAwesomeIcon icon={faAngleLeft} /></button>
                        
                        <span className="font-bold">{current.toLocaleString("default", { month: "long" }) /* month-name */} {year}</span>
                        
                        <button type="button" onClick={() => navigateMonth(1)}><FontAwesomeIcon icon={faAngleRight} /></button>
                    </div>

                    <table className="p-2 bg-gray-100 w-full">
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
                                                <td key={i} className="relative p-1 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleSelect(e, date)}
                                                        className={`${(selected === ymd(date)) ? "bg-gray-500 text-white" : ((ymd(date) === ymd(new Date())) ? "bg-gray-200 border border-gray-500" : "bg-gray-200 border border-transparent hover:bg-gray-300")} w-full rounded transition-colors duration-150`}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                    {hasEventOnDate(date) && (
                                                        <FontAwesomeIcon icon={faCircle} className="absolute top-2 right-2 text-[8px]" />
                                                    )}
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

            <div id="tijdschemaModal" className="fixed top-0 left-64 right-0 z-10 hidden bg-black/40 w-full h-full overflow-auto">
                <div className="flex flex-col items-start p-2 bg-white w-full rounded">
                        <fieldset className="mb-2">
                            <legend className='block mb-2'>Schakel modus op:</legend>
                            <input type="date" name="date" defaultValue={newSchema.date} onChange={handleChange} className="p-2 bg-gray-200 rounded-lg" /> om <input type="time" name="time" defaultValue={newSchema.time} min={minTime} onChange={handleChange} className="p-2 bg-gray-200 rounded-lg" />
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <label htmlFor="modus-select" className="block mb-2">Naar:</label>
                            <select id="modus-select" name="modus" value={newSchema.modus} onChange={handleChange} className="p-2 bg-gray-200 rounded-lg">
                                <option value="normaal">Normaal</option>
                                <option value="eco">Eco</option>
                            </select>
                        </fieldset>

                        <fieldset className="mb-2">
                            <label className="inline-flex items-center">
                                <span className="me-3">Herhalen</span>
                                <input type="checkbox" name="onRepeat" defaultChecked={newSchema.onRepeat} onChange={handleChange} className="sr-only peer" />
                                <div className="relative bg-gray-200 w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </fieldset>
                        
                        {intervalTypes.map((intervalType, index) => (
                            <fieldset className="mb-2" key={index}>
                                <input
                                    type="radio"
                                    name="repeatInterval"
                                    defaultValue={intervalType}
                                    onChange={handleChange}
                                    disabled={!newSchema.onRepeat}
                                />
                                <label htmlFor={intervalLabels[intervalType]} className="mb-2">
                                    <span className="ms-1">
                                        Elke{" "}
                                        <input
                                            key={`${intervalType}-${newSchema.repeatInterval}`}
                                            id={intervalLabels[intervalType]}
                                            type="number"
                                            name="repeat"
                                            defaultValue={(!newSchema.onRepeat || newSchema.repeatInterval !== intervalType) ? "" : 1}
                                            min="1"
                                            onChange={handleChange}
                                            className="border-b"
                                            disabled={!newSchema.onRepeat || newSchema.repeatInterval !== intervalType}
                                        />{" "}
                                        {intervalLabels[intervalType]} herhalen
                                    </span>
                                </label>
                            </fieldset>
                        ))}

                        <fieldset className="mb-2">
                            <label className="inline-flex items-center">
                                <span className="me-3">Voor welke duratie</span>
                            </label>
                        </fieldset>
                        
                        {repeatTypes.map((repeatType, index) => (
                            <fieldset className="mb-2" key={index}>
                                <input
                                    type="radio"
                                    name="repeatType"
                                    defaultValue={repeatType}
                                    onChange={handleChange}
                                    disabled={!newSchema.onRepeat || !hasRepInterval}
                                />
                                <label htmlFor={repeatLabels[repeatType]} className="mb-2">
                                    {repeatLabels[repeatType] === "forever" ? (
                                        <span className="ms-1">
                                            {repeatLabels[repeatType] + " "}
                                            <input
                                                key={`${repeatType}-${hasRepType}`}
                                                id={repeatLabels[repeatType]}
                                                type="hidden"
                                                name="repeatDuration"
                                                defaultValue={(!newSchema.onRepeat || hasRepType !== repeatType) ? "" : "forever"}
                                                onChange={handleChange}
                                                className="border-b"
                                                disabled={!newSchema.onRepeat || hasRepType !== repeatType}
                                            />
                                        </span>
                                    ):(
                                        <span className="ms-1">
                                            {repeatLabels[repeatType] + " "}
                                            <input
                                                key={`${repeatType}-${hasRepType}`}
                                                id={repeatLabels[repeatType]}
                                                type="number"
                                                name="repeatDuration"
                                                defaultValue={(!newSchema.onRepeat || hasRepType !== repeatType) ? "" : 1}
                                                min="1"
                                                onChange={handleChange}
                                                className="border-b"
                                                disabled={!newSchema.onRepeat || hasRepType !== repeatType}
                                            /> herhalen
                                        </span>
                                    )}
                                </label>
                            </fieldset>
                        ))}
                        
                        {/* <fieldset className="mb-2">
                            <input type="radio" name="repeatInterval" defaultValue={"day"} onChange={handleChange} disabled={!newSchema.onRepeat} />
                            <label htmlFor="day" className="mb-2">
                                <span className="ms-1">Elke <input id="day" type="number" name="repeat" defaultValue={(!newSchema.onRepeat || newSchema.repeatInterval !== "day") ? "" : newSchema.repeat} min="1" onChange={handleChange} className="border-b" disabled={!newSchema.onRepeat || newSchema.repeatInterval !== "day"} /> dag herhalen</span>
                            </label>
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <input type="radio" name="repeatInterval" defaultValue={"week"} onChange={handleChange} disabled={!newSchema.onRepeat} />
                            <label htmlFor="week" className="mb-2">
                                <span className="ms-1">Elke <input id="week" type="number" name="repeat" defaultValue={(!newSchema.onRepeat || newSchema.repeatInterval !== "week") ? "" : newSchema.repeat} min="1" onChange={handleChange} className="border-b" disabled={!newSchema.onRepeat || newSchema.repeatInterval !== "week"} /> week herhalen</span>
                            </label>
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <input type="radio" name="repeatInterval" defaultValue={"month"} onChange={handleChange} disabled={!newSchema.onRepeat} />
                            <label htmlFor="month" className="mb-2">
                                <span className="ms-1">Elke <input id="month" type="number" name="repeat" defaultValue={(!newSchema.onRepeat || newSchema.repeatInterval !== "month") ? "" : newSchema.repeat} min="1" onChange={handleChange} className="border-b" disabled={!newSchema.onRepeat || newSchema.repeatInterval !== "month"} /> maand herhalen</span>
                            </label>
                        </fieldset>
                        
                        <fieldset className="mb-2">
                            <input type="radio" name="repeatInterval" defaultValue={"year"} onChange={handleChange} disabled={!newSchema.onRepeat} />
                            <label htmlFor="year" className="mb-2">
                                <span className="ms-1">Elk <input id="year" type="number" name="repeat" defaultValue={(!newSchema.onRepeat || newSchema.repeatInterval !== "year") ? "" : newSchema.repeat} min="1" onChange={handleChange} className="border-b" disabled={!newSchema.onRepeat || newSchema.repeatInterval !== "year"} /> jaar herhalen</span>
                            </label>
                        </fieldset> */}

                        <fieldset className="mb-2">
                            <button type="button" onClick={() => closeModal()}>Annuleren</button>
                            <button type="button" onClick={() => {submitCalendar(); closeModal()}}>Opslaan</button>
                        </fieldset>
                </div>
            </div>
        </>
    );
}

export { Calendar };