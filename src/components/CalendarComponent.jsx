import React, { useState } from "react";

function Calendar({ initialDate = new Date() }) {
    const [current, setCurrent] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [selected, setSelected] = useState(null);

    const year = current.getFullYear();
    const month = current.getMonth();

    const pad = (n) => {
        String(n).padStart(2, "0");
    }

    const ymd = (d) => {
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    const todayKey = ymd(new Date());

    const startOffset = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
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

    const go = (delta) => {
        setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{current.toLocaleString("default", { month: "long" }) /* month-name */} {year}</h2>
                
                <div className="flex gap-2">
                    <button
                        onClick={() => go(-1)}
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => go(1)}
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                    >
                        Next
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="text-gray-600 text-sm">
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => (
                            <th key={day} className="p-2 font-medium">{day}</th>
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
                                                onClick={() => setSelected(ymd(date))}
                                                className={`w-10 h-10 rounded-full transition-colors duration-150 ${(selected === ymd(date)) ? "bg-indigo-500 text-white" : ((ymd(date) === todayKey) ? "border border-indigo-500" : "hover:bg-gray-100")}`}
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

            <div className="mt-4 text-sm text-gray-600">
                Selected: {selected ?? "None"}
            </div>
        </div>
    );
}

export { Calendar };