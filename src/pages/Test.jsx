import { useState, useEffect } from 'react'

function Test() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': '',
                        'User-Agent': 'Insomnia/2023.5.6'
                    },
                    body: JSON.stringify({
                        "token" : `21129FCC24`,
                        "query" : `# query asking for room temperature of heatpumps in the network
                            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                            PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
                            PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
                            PREFIX saref: <https://saref.etsi.org/core/>
                            SELECT * WHERE {
                                ?heatpump rdf:type hco:Heatpump .
                                ?measurement rdf:type saref:Measurement .
                                ?measurement saref:measurementMadeBy ?heatpump .
                                ?measurement saref:relatesToProperty hco:roomTemperature .
                                ?measurement saref:isMeasuredIn om:degreeCelsius .
                                ?measurement saref:hasValue ?roomTemperature .
                            }
                        `
                    })
                });

                // Room Temperature
                // SELECT * WHERE {
                //     ?heatpump rdf:type hco:Heatpump .
                //     ?measurement rdf:type saref:Measurement .
                //     ?measurement saref:measurementMadeBy ?heatpump .
                //     ?measurement saref:relatesToProperty hco:roomTemperature .
                //     ?measurement saref:isMeasuredIn om:degreeCelsius .
                //     ?measurement saref:hasValue ?roomTemperature .
                // }

                // Room Temperature Setpoint
                // SELECT * WHERE {
                //     ?heatpump rdf:type hco:Heatpump .
                //     ?measurement rdf:type saref:Measurement .
                //     ?measurement saref:measurementMadeBy ?heatpump .
                //     ?measurement saref:relatesToProperty hco:temperatureSetpoint .
                //     ?measurement saref:isMeasuredIn om:degreeCelsius .
                //     ?measurement saref:hasValue ?temperatureSetpoint .
                // }

                // Current Status
                // SELECT * WHERE {
                //     ?heatpump rdf:type hco:Heatpump .
                //     ?state rdf:type ?stateType .
                //     ?heatpump saref:hasState ?state .
                //     ?state hco:hasStartTime ?startDateTime .
                //     ?state hco:hasEndTime ?endDateTime .
                // }

                // Current Error
                // SELECT * WHERE {
                //     ?heatpump rdf:type hco:Heatpump .
                //     ?state rdf:type hco:ErrorState .
                //     ?heatpump saref:hasState ?state .
                //     ?state hco:hasErrorValue ?errorValue .
                //     ?state hco:hasStartTime ?startDateTime .
                //     ?state hco:hasEndTime ?endDateTime .
                // }

                // Electricity Usage
                // SELECT * WHERE {
                //     ?heatpump rdf:type hco:Heatpump .
                //     ?measurement rdf:type saref:Measurement .
                //     ?measurement saref:measurementMadeBy ?heatpump .
                //     ?measurement saref:isMeasurementOf ?heatpump .
                //     ?measurement saref:relatesToProperty hco:electricityUsage .
                //     ?measurement saref:isMeasuredIn om:kiloWattHour .
                //     ?measurement saref:hasTimestamp ?timestamp .
                //     ?heatpump hco:hasAccuracy ?accuracy .
                //     ?accuracy rdf:type hco:HeatpumpElectricitymeterAccuracy .
                //     ?measurement saref:hasValue ?electricityUsageHeatpump .
                // }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json()

                console.log(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <div className="flex items-center justify-center">
                <span>Test page</span>
            </div>
        </>
    )
}

export default Test
