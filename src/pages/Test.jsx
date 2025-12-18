import { useState, useEffect } from 'react'

function Test() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ currentRoomTemp, setCurrentRoomTemp ] = useState(null);
    const [ roomTempSetpoint, setRoomTempSetpoint ] = useState(null);
    const [ currentOutsideTemp, setCurrentOutsideTemp ] = useState(null);
    const [ currentState, setCurrentState ] = useState(null);
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchCurrentRoomTemp = async () => {
            try {
                const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/sparql-query',
                        'Accept': 'application/json'
                    },
                    body: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/> PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#> PREFIX saref: <https://saref.etsi.org/core/> PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/> SELECT ?heatpump ?id ?building ?heatPump ?room ?currentTemperature ?observation ?result ?value ?unit WHERE { ?heatPump rdf:type hco:HeatPump ; saref:hasIdentifier ?id . ?building rdf:type saref4bldg:Building ; saref4bldg:contains ?heatPump ; saref4bldg:hasSpace ?room . ?room rdf:type saref4bldg:BuildingSpace, saref:FeatureOfInterest; saref:hasPropertyOfInterest ?currentTemperature . ?currentTemperature rdf:type saref:PropertyOfInterest ; saref:hasPropertyKind hco:CurrentTemperature . ?heatPump saref:madeExecution ?observation . ?observation rdf:type hco:LatestObservation ; saref:observes ?room, ?currentTemperature ; saref:hasResult ?result . ?result rdf:type saref:PropertyValue ; saref:isValueOfProperty ?currentTemperature ; saref:hasValue ?value ; saref:isMeasuredIn ?unit . }'
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                setCurrentRoomTemp(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }
        
        const fetchRoomTempSetpoint = async () => {
            try {
                const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/sparql-query',
                        'Accept': 'application/json'
                    },
                    body: `
                        PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
                        PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
                        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                        PREFIX saref: <https://saref.etsi.org/core/>
                        PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/> 
                        
                        SELECT ?id ?value ?unit
                        WHERE {
                            ?heatPump rdf:type hco:HeatPump ;
                                        saref:hasIdentifier ?id ;
                                        saref:hasPropertyOfInterest ?temperatureSetpoint .
                            ?temperatureSetpoint rdf:type saref:PropertyOfInterest ;
                                                    saref:hasPropertyKind hco:TemperatureSetpoint .
                            ?building rdf:type saref4bldg:Building ;
                                        saref4bldg:contains ?heatPump ;
                                        saref4bldg:hasSpace ?room .
                            ?room rdf:type saref4bldg:BuildingSpace .
                            ?heatPump saref:madeExecution ?observation .
                            ?observation rdf:type hco:LatestObservation ;
                                        saref:observes ?heatPump, ?temperatureSetpoint ;
                                        saref:hasResult ?result .
                            ?result rdf:type saref:PropertyValue ;
                                    saref:isValueOfProperty ?temperatureSetpoint ;
                                    saref:consistsOf ?room ;
                                    saref:consistsOf ?temperatureResult .
                            ?temperatureResult rdf:type saref:PropertyValue ;
                                                saref:hasValue ?value ;
                                                saref:isMeasuredIn ?unit .
                        }`
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                setRoomTempSetpoint(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        const fetchCurrentOutsideTemp = async () => {
            try {
                const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/sparql-query',
                        'Accept': 'application/json'
                    },
                    body: `
                        PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
                        PREFIX bot: <https://w3id.org/bot#>
                        PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
                        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                        PREFIX saref: <https://saref.etsi.org/core/>
                        PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/> 
                        
                        SELECT ?id ?value ?unit
                        WHERE {
                            ?heatPump rdf:type hco:HeatPump ;
                                        saref:hasIdentifier ?id .
                            ?outside rdf:type bot:Zone, saref:FeatureOfInterest ;
                                        saref:hasPropertyOfInterest ?currentTemperature ;
                                        bot:hasBuilding ?building .
                            ?building rdf:type saref4bldg:Building ;
                                        saref4bldg:contains ?heatPump .
                            ?currentTemperature rdf:type saref:PropertyOfInterest ;
                                                saref:hasPropertyKind hco:CurrentTemperature .
                            ?heatPump saref:madeExecution ?observation .
                            ?observation rdf:type hco:LatestObservation ;
                                        saref:observes ?outside, ?currentTemperature ;
                                        saref:hasResult ?result .
                            ?result rdf:type saref:PropertyValue ;
                                    saref:isValueOfProperty ?currentTemperature ;
                                    saref:hasValue ?value ;
                                    saref:isMeasuredIn ?unit .
                        }`
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                setCurrentOutsideTemp(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }
        
        const fetchCurrentState = async () => {
            try {
                const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/sparql-query',
                        'Accept': 'application/json'
                    },
                    body: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/> PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#> PREFIX saref: <https://saref.etsi.org/core/> SELECT ?heatpump ?id ?state ?stateType ?startDateTime ?endDateTime WHERE { ?heatPump rdf:type hco:Heatpump ; saref:hasIdentifier ?id . ?state rdf:type ?stateType . ?heatPump saref:hasState ?state . ?state hco:hasStartTime ?startDateTime . ?state hco:hasEndTime ?endDateTime .  }'
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                setCurrentState(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }

        fetchCurrentRoomTemp();
        fetchRoomTempSetpoint();
        fetchCurrentOutsideTemp();
        fetchCurrentState();
    }, []);

    useEffect(() => {
        console.log(`Current Room Temperature: ${JSON.stringify(currentRoomTemp)}`);
        console.log(`Room Temperature Setpoint: ${JSON.stringify(roomTempSetpoint)}`);
        console.log(`Current Outside Temperature: ${JSON.stringify(currentOutsideTemp)}`);
        console.log(`Current State: ${JSON.stringify(currentState)}`);

        setData({
            "huidigeStatus": currentState,
            "huidigeTemperatuur": currentRoomTemp,
        });
    }, [currentRoomTemp, roomTempSetpoint, currentOutsideTemp, currentState]);

    return (
        <>
            <div className="flex items-center justify-center">
                <span>Test page</span>
                
                <br />
                
                <div>
                    <p>{data.currentState}</p>
                </div>

                <br />
                
                <div>
                    <p>{data.currentRoomTemp}</p>
                </div>
            </div>
        </>
    )
}

export default Test
