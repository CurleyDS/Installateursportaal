import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';

function Calendar({ data = [], onUpdate }) {
    const [tijdschemas, setTijdschemas] = useState(data);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [current, setCurrent] = useState(new Date());
    const [selected, setSelected] = useState(null);
    const [minTime, setMinTime] = useState(null);
    const [createSchema, setCreateSchema] = useState({});
    const [hasRepInterval, setRepInterval] = useState(null);

    // Calendar Setup
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

    const hasEventOnDate = (checkDate) => {
        return tijdschemas.some((schema) => {
            const schemaDate = new Date(schema.date);

            // Non-repeating event
            if (!schema.onRepeat) {
                return ymd(schemaDate) === ymd(checkDate);
            }

            // Repeating event
            let occurrenceDate = new Date(schemaDate);
            let occurrenceIndex = 0;

            while (true) {
            // Stop if we've reached the duration for count/until types
            if (
                (schema.durationType === "count" || schema.durationType === "until") &&
                occurrenceIndex >= schema.duration
            ) {
                break;
            }

            // Match found
            if (ymd(occurrenceDate) === ymd(checkDate)) return true;

            // Increment date according to interval
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

            // Safety break to prevent infinite loops from bad data
                if (occurrenceIndex > 10000) break;
            }

            return false;
        });
    };

    useEffect(() => {
        onUpdate(tijdschemas);
    }, [tijdschemas]);
    
    // Modal Setup
    const intervalTypes = ["day", "week", "month", "year"];

    const intervalLabels = {
        day: "dag",
        week: "week",
        month: "maand",
        year: "jaar",
    };

    const calcDuration = (s, e, interval = createSchema.repeatInterval) => {
        const start = new Date(s);
        const end = new Date(e);

        if (!s || !e || isNaN(start) || isNaN(end) || end < start) return 0;

        if (interval === "day") {
            return (Math.floor(((end - start) / 86400000)) + 1);
        }
        
        if (interval === "week") {
            return (Math.floor(((end - start) / 86400000) / 7) + 1);
        }
        
        if (interval === "month") {
            return ((end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + (end.getDate() >= start.getDate() ? 1 : 0));
        }

        if (interval === "year") {
            return ((end.getFullYear() - start.getFullYear()) + ((end.getMonth() > start.getMonth() || (end.getMonth() === start.getMonth() && end.getDate() >= start.getDate())) ? 1 : 0));
        }
    };

    const openModal = () => {
        document.getElementById("tijdschemaModal").classList.remove('hidden');
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        let inputValue = value;

        // input-value validation for checkboxes
        if (type === "checkbox") {
            inputValue = checked;
        }

        // input-value validation for numbers
        if (type === "number") {
            inputValue = Number(value);
        }

        setCreateSchema((oldSchema) => {
            let updatedSchema = {
                ...oldSchema,
                [name]: inputValue,
            };

            // reset repeat-input when repeat-interval gets toggled
            if (name === "repeatInterval") {
                updatedSchema.repeat = 1;
                setRepInterval(true);
            }

            // reset duration-input when duration-type gets toggled
            if (name === "durationType") {
                updatedSchema.duration = 0;

                if (oldSchema.durationType === "until") {
                    updatedSchema.duration = oldSchema.date;
                };
            }

            return updatedSchema;
        });
    };
    
    const submitCalendar = () => {
        let newSchema = { ...createSchema };

        if (newSchema.durationType === "until") {
            newSchema.duration = calcDuration(newSchema.date, newSchema.duration);
        }

        console.log("Submitting:", newSchema);

        setTijdschemas((oldSchemas) => [...oldSchemas, newSchema]);
    };

    const closeModal = () => {
        document.getElementById("tijdschemaModal").classList.add('hidden');
    };

    useEffect(() => {
        const setupModalData = async () => {
            try {
                let calculatedDate = ymd(current);
                let calculatedTime = "08:00";
                let calculatedMinTime = "00:00";
        
                if (selected && selected <= ymd(current)) {
                    calculatedDate = selected;
                    calculatedTime = `${String(current.getHours() + 1).padStart(2, "0")}:00`;
                    calculatedMinTime = `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}`;
                }
                
                setCreateSchema({
                    date: calculatedDate,
                    time: calculatedTime,
                    modus: "normaal",
                    onRepeat: false,
                    repeat: 1,
                    repeatInterval: "day",
                    duration: 0,
                    durationType: "count"
                });
                
                setMinTime(calculatedMinTime);
                setRepInterval(false);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        setupModalData();
    }, [selected]);

    window.onclick = function(event) {
        if (event.target == document.getElementById("tijdschemaModal")) {
            document.getElementById("tijdschemaModal").classList.add('hidden');
        }
    };

    if (loading) {
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
                                <input type="date" name="date" value={createSchema.date} min={ymd(current)} onChange={handleChange} className="p-2 bg-gray-200 rounded-lg" /> om <input type="time" name="time" value={createSchema.time} min={minTime} onChange={handleChange} className="p-2 bg-gray-200 rounded-lg" />
                            </fieldset>
                            
                            <fieldset className="mb-2">
                                <label htmlFor="modus-select" className="block mb-2">Naar:</label>
                                <select id="modus-select" name="modus" value={createSchema.modus} onChange={handleChange} className="p-2 bg-gray-200 rounded-lg">
                                    <option value="normaal">Normaal</option>
                                    <option value="eco">Eco</option>
                                </select>
                            </fieldset>

                            <fieldset className="mb-2">
                                <label className="inline-flex items-center">
                                    <span className="me-3">Herhalen</span>
                                    <input type="checkbox" name="onRepeat" checked={createSchema.onRepeat} onChange={handleChange} className="sr-only peer" />
                                    <div className="relative bg-gray-200 w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </fieldset>
                            
                            {intervalTypes.map((intervalType, index) => (
                                <fieldset className="mb-2" key={index}>
                                    <input
                                        type="radio"
                                        name="repeatInterval"
                                        value={intervalType}
                                        onChange={handleChange}
                                        disabled={!createSchema.onRepeat}
                                    />
                                    <label htmlFor={intervalLabels[intervalType]} className="mb-2">
                                        <span className="ms-1">
                                            Elke{" "}
                                            <input
                                                key={`${intervalType}-${createSchema.repeatInterval}`}
                                                id={intervalLabels[intervalType]}
                                                type="number"
                                                name="repeat"
                                                value={(createSchema.onRepeat && createSchema.repeatInterval === intervalType) ? createSchema.repeat : ""}
                                                min={1}
                                                onChange={handleChange}
                                                className="border-b"
                                                disabled={!createSchema.onRepeat || createSchema.repeatInterval !== intervalType}
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
                            
                            <fieldset className="mb-2">
                                <input
                                    type="radio"
                                    name="durationType"
                                    value="count"
                                    onChange={handleChange}
                                    disabled={!createSchema.onRepeat || !hasRepInterval}
                                />
                                <label htmlFor="specifieke-hoeveelheid" className="mb-2">
                                    <span className="ms-1">
                                        Specifiek <input
                                            key={`count-${createSchema.durationType}`}
                                            id="specifieke-hoeveelheid"
                                            type="number"
                                            name="duration"
                                            value={(createSchema.onRepeat && hasRepInterval && createSchema.durationType === "count") ? createSchema.duration : ""}
                                            min={0}
                                            onChange={handleChange}
                                            className="border-b"
                                            disabled={!createSchema.onRepeat || !hasRepInterval || createSchema.durationType !== "count"}
                                        /> keer herhalen
                                    </span>
                                </label>
                            </fieldset>

                            <fieldset className="mb-2">
                                <input
                                    type="radio"
                                    name="durationType"
                                    value="until"
                                    onChange={handleChange}
                                    disabled={!createSchema.onRepeat || !hasRepInterval}
                                />
                                <label htmlFor="tot-datum" className="mb-2">
                                    <span className="ms-1">
                                        Tot <input
                                            key={`until-${createSchema.durationType}`}
                                            id="tot-datum"
                                            type="date"
                                            name="duration"
                                            value={(createSchema.onRepeat && hasRepInterval && createSchema.durationType === "until") ? createSchema.duration : ""}
                                            min={createSchema.date}
                                            onChange={handleChange}
                                            className="border-b"
                                            disabled={!createSchema.onRepeat || !hasRepInterval || createSchema.durationType !== "until"}
                                        /> herhalen
                                    </span>
                                </label>
                            </fieldset>

                            <fieldset className="mb-2">
                                <input
                                    type="radio"
                                    name="durationType"
                                    value="forever"
                                    onChange={handleChange}
                                    disabled={!createSchema.onRepeat || !hasRepInterval}
                                />
                                <label htmlFor="altijd" className="mb-2">
                                    <span className="ms-1">
                                        Altijd <input
                                            key={`forever-${createSchema.durationType}`}
                                            id="altijd"
                                            type="hidden"
                                            name="duration"
                                            value={(createSchema.onRepeat && hasRepInterval && createSchema.durationType === "forever") ? createSchema.duration : ""}
                                            onChange={handleChange}
                                            className="border-b"
                                            disabled={!createSchema.onRepeat || !hasRepInterval || createSchema.durationType !== "forever"}
                                        /> herhalen
                                    </span>
                                </label>
                            </fieldset>

                            <fieldset className="mb-2">
                                <button type="button" onClick={() => closeModal()}>Annuleren</button>
                                <button type="button" onClick={() => {submitCalendar(); closeModal()}}>Opslaan</button>
                            </fieldset>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div className="p-2">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }
}

export { Calendar };