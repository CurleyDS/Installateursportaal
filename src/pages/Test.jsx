import { useState, useEffect } from 'react'

function Test() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [heatpump, setHeatpump] = useState(null);
    // const [currentTemp, setCurrentTemp] = useState(null);
    // const [roomTempSetpoint, setRoomTempSetpoint] = useState(null);
    // const [currentOutsideTemp, setCurrentOutsideTemp] = useState(null);
    // const [currentState, setCurrentState] = useState(null);
    // const [cop, setCOP] = useState(null);
    // const [energyUse, setEnergyUse] = useState(null);
    const [testData, setTestData] = useState(null);
    const [data, setData] = useState({});

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('/test-data.json');

    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }

    //             const data = await response.json()

    //             console.log(data);
    //         } catch (error) {
    //             setError(error);
    //         } finally {
    //             setLoading(true);
    //         }
    //     }

    //     fetchData();
    // }, []);

    // const fetchHeatpump = async () => {
    //     try {
    //         const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/sparql-query',
    //                 'Accept': 'application/json'
    //             },
    //             body: `
    //                 PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
    //                 PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
    //                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //                 PREFIX saref: <https://saref.etsi.org/core/>
    //                 PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/>
                    
    //                 SELECT ?heatPump ?id ?serialNumber ?yearOfManufacture ?exchangeKind
    //                         ?heatPumpKind ?manufacturer ?model
    //                 #        ?subdevice ?subdeviceId ?subdeviceType
    //                 WHERE {
    //                     ?heatPump rdf:type hco:HeatPump ;
    //                                 saref:hasIdentifier ?id ;
    //                                 hco:hasSerialNumber ?serialNumber ;
    //                                 hco:hasYearOfManufacture ?yearOfManufacture ;
    //                                 hco:hasExchangeKind ?exchangeKind ;
    //                                 saref:hasDeviceKind ?heatPumpKind .
    //                     #            saref:consistsOf ?subdevice .
    //                     ?heatPumpKind rdf:type saref:DeviceKind ;
    //                                 saref:hasManufacturer ?manufacturer ;
    //                                 saref:hasModel ?model .
    //                 #    ?subdevice rdf:type saref:Device ;
    //                 #                saref:hasIdentifier ?subdeviceId ;
    //                 #                rdf:type ?subdeviceType
    //                 }`
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         setHeatpump(data.results);
    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(true);
    //     }
    // }
    
    // const fetchCurrentTemp = async () => {
    //     try {
    //         const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/sparql-query',
    //                 'Accept': 'application/json'
    //             },
    //             body: `
    //                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //                 PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
    //                 PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
    //                 PREFIX saref: <https://saref.etsi.org/core/>
    //                 PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/>
                    
    //                 SELECT ?heatpump ?id ?building ?heatPump ?room ?currentTemperature ?observation ?result ?value ?unit
    //                 WHERE {
    //                     ?heatPump rdf:type hco:HeatPump ;
    //                                 saref:hasIdentifier ?id .
    //                     ?building rdf:type saref4bldg:Building ;
    //                                 saref4bldg:contains ?heatPump ;
    //                                 saref4bldg:hasSpace ?room .
    //                     ?room rdf:type saref4bldg:BuildingSpace, saref:FeatureOfInterest;
    //                                 saref:hasPropertyOfInterest ?currentTemperature .
    //                     ?currentTemperature rdf:type saref:PropertyOfInterest ;
    //                                 saref:hasPropertyKind hco:CurrentTemperature .
    //                     ?heatPump saref:madeExecution ?observation .
    //                     ?observation rdf:type hco:LatestObservation ;
    //                                 saref:observes ?room, ?currentTemperature ;
    //                                 saref:hasResult ?result .
    //                     ?result rdf:type saref:PropertyValue ;
    //                                 saref:isValueOfProperty ?currentTemperature ;
    //                                 saref:hasValue ?value ;
    //                                 saref:isMeasuredIn ?unit .
    //                 }`
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         setCurrentTemp(data.results);
    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(true);
    //     }
    // }
    
    // const fetchRoomTempSetpoint = async () => {
    //     try {
    //         const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/sparql-query',
    //                 'Accept': 'application/json'
    //             },
    //             body: `
    //                 PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
    //                 PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
    //                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //                 PREFIX saref: <https://saref.etsi.org/core/>
    //                 PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/> 
                    
    //                 SELECT ?id ?value ?unit
    //                 WHERE {
    //                     ?heatPump rdf:type hco:HeatPump ;
    //                                 saref:hasIdentifier ?id ;
    //                                 saref:hasPropertyOfInterest ?temperatureSetpoint .
    //                     ?temperatureSetpoint rdf:type saref:PropertyOfInterest ;
    //                                 saref:hasPropertyKind hco:TemperatureSetpoint .
    //                     ?building rdf:type saref4bldg:Building ;
    //                                 saref4bldg:contains ?heatPump ;
    //                                 saref4bldg:hasSpace ?room .
    //                     ?room rdf:type saref4bldg:BuildingSpace .
    //                     ?heatPump saref:madeExecution ?observation .
    //                     ?observation rdf:type hco:LatestObservation ;
    //                                 saref:observes ?heatPump, ?temperatureSetpoint ;
    //                                 saref:hasResult ?result .
    //                     ?result rdf:type saref:PropertyValue ;
    //                                 saref:isValueOfProperty ?temperatureSetpoint ;
    //                                 saref:consistsOf ?room ;
    //                                 saref:consistsOf ?temperatureResult .
    //                     ?temperatureResult rdf:type saref:PropertyValue ;
    //                                 saref:hasValue ?value ;
    //                                 saref:isMeasuredIn ?unit .
    //                 }`
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         setRoomTempSetpoint(data.results);
    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(true);
    //     }
    // }

    // const fetchCurrentOutsideTemp = async () => {
    //     try {
    //         const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/sparql-query',
    //                 'Accept': 'application/json'
    //             },
    //             body: `
    //                 PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
    //                 PREFIX bot: <https://w3id.org/bot#>
    //                 PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
    //                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //                 PREFIX saref: <https://saref.etsi.org/core/>
    //                 PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/> 
                    
    //                 SELECT ?id ?value ?unit
    //                 WHERE {
    //                     ?heatPump rdf:type hco:HeatPump ;
    //                                 saref:hasIdentifier ?id .
    //                     ?outside rdf:type bot:Zone, saref:FeatureOfInterest ;
    //                                 saref:hasPropertyOfInterest ?currentTemperature ;
    //                                 bot:hasBuilding ?building .
    //                     ?building rdf:type saref4bldg:Building ;
    //                                 saref4bldg:contains ?heatPump .
    //                     ?currentTemperature rdf:type saref:PropertyOfInterest ;
    //                                 saref:hasPropertyKind hco:CurrentTemperature .
    //                     ?heatPump saref:madeExecution ?observation .
    //                     ?observation rdf:type hco:LatestObservation ;
    //                                 saref:observes ?outside, ?currentTemperature ;
    //                                 saref:hasResult ?result .
    //                     ?result rdf:type saref:PropertyValue ;
    //                                 saref:isValueOfProperty ?currentTemperature ;
    //                                 saref:hasValue ?value ;
    //                                 saref:isMeasuredIn ?unit .
    //                 }`
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         setCurrentOutsideTemp(data.results);
    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(true);
    //     }
    // }
    
    // const fetchCurrentState = async () => {
    //     try {
    //         const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/sparql-query',
    //                 'Accept': 'application/json'
    //             },
    //             body: `
    //                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //                 PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
    //                 PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
    //                 PREFIX saref: <https://saref.etsi.org/core/>
                    
    //                 SELECT ?heatpump ?id ?state ?stateType ?startDateTime ?endDateTime
    //                 WHERE {
    //                     ?heatPump rdf:type hco:Heatpump ;
    //                                 saref:hasIdentifier ?id .
    //                     ?state rdf:type ?stateType .
    //                     ?heatPump saref:hasState ?state .
    //                     ?state hco:hasStartTime ?startDateTime .
    //                     ?state hco:hasEndTime ?endDateTime .
    //                 }`
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         setCurrentState(data.results);
    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(true);
    //     }
    // }
    
    // const fetchCOP = async () => {
    //     try {
    //         const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/sparql-query',
    //                 'Accept': 'application/json'
    //             },
    //             body: `
    //                 PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
    //                 PREFIX bot: <https://w3id.org/bot#>
    //                 PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
    //                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //                 PREFIX saref: <https://saref.etsi.org/core/>
    //                 PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/>
                    
    //                 SELECT ?heatpump ?id ?cop ?observation ?result ?value
    //                 WHERE {
    //                     ?heatPump rdf:type hco:HeatPump .
    //                     ?heatPump saref:hasIdentifier ?id .
    //                     ?heatPump saref:hasPropertyOfInterest ?cop .
    //                     ?cop rdf:type saref:PropertyOfInterest .
    //                     ?cop saref:hasPropertyKind hco:COP .
    //                     ?heatPump saref:madeExecution ?observation .
    //                     ?observation rdf:type saref:Observation .
    //                     ?observation saref:observes ?heatPump, ?cop .
    //                     ?observation saref:hasResult ?result .
    //                     ?result rdf:type saref:PropertyValue .
    //                     ?result saref:isValueOfProperty ?cop .
    //                     ?result saref:hasValue ?value .
    //                     ?result saref:isMeasuredIn hco:KilowattPerKilowatt .
    //                 }`
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         setCOP(data.results);
    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(true);
    //     }
    // }
    
    // const fetchEnergyUse = async () => {
    //     try {
    //         const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/sparql-query',
    //                 'Accept': 'application/json'
    //             },
    //             body: `
    //                 PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
    //                 PREFIX bot: <https://w3id.org/bot#>
    //                 PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
    //                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //                 PREFIX saref: <https://saref.etsi.org/core/>
    //                 PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/>
                    
    //                 SELECT ?heatpump ?id ?energyUse ?observation ?result ?value ?unit
    //                 WHERE {
    //                     ?heatPump rdf:type hco:HeatPump .
    //                     ?heatPump saref:hasIdentifier ?id .
    //                     ?heatPump saref:hasPropertyOfInterest ?energyUse .
    //                     ?energyUse rdf:type saref:PropertyOfInterest .
    //                     ?energyUse saref:hasPropertyKind hco:ElectricityUse .
    //                     ?heatPump saref:madeExecution ?observation .
    //                 #    ?heatPump ?observation rdf:type hco:LatestObservation .
    //                 #    ?heatPump saref:observes ?heatPump, ?energyUse .
    //                 #    ?heatPump saref:hasResult ?result .
    //                     ?result rdf:type saref:PropertyValue .
    //                     ?result saref:isValueOfProperty ?energyUse .
    //                     ?result saref:hasValue ?value .
    //                     ?result saref:isMeasuredIn ?unit .
    //                 }`
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         setEnergyUse(data.results);
    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(true);
    //     }
    // }

    const fetchTestData = async () => {
        try {
            const response = await fetch('https://hupie.northeurope.cloudapp.azure.com/hupie/query/?token=21129FCC24', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/sparql-query',
                    'Accept': 'application/json'
                },
                body: `
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                    PREFIX om: <http://www.ontology-of-units-of-measure.org/resource/om-2/>
                    PREFIX hco: <https://www.tno.nl/building/ontology/heatpump-common-ontology#>
                    PREFIX saref: <https://saref.etsi.org/core/>
                    # PREFIX saref4bldg: <https://saref.etsi.org/saref4bldg/>
                    # PREFIX saref4watr: <https://saref.etsi.org/saref4watr/>
                    PREFIX bot: <https://w3id.org/bot#>
                    
                    SELECT ?heatPump ?id ?building ?room ?propertyKind ?observation ?value ?unit ?state ?stateType ?startDateTime ?endDateTime
                    WHERE {
                        # 1) Heat pump + identifier
                        ?heatPump rdf:type hco:HeatPump ;
                                    saref:hasIdentifier ?id .

                        # 2) Building and room
                        ?building rdf:type saref4bldg:Building ;
                                    saref4bldg:contains ?heatPump ;
                                    saref4bldg:hasSpace ?room .

                        # 3) Temperature measurement
                        ?room rdf:type saref4bldg:BuildingSpace, saref:FeatureOfInterest ;
                                saref:hasPropertyOfInterest ?tempProperty .

                        ?tempProperty rdf:type saref:PropertyOfInterest ;
                                        saref:hasPropertyKind hco:CurrentTemperature .

                        ?heatPump saref:madeExecution ?tempObservation .
                        ?tempObservation rdf:type hco:LatestObservation ;
                                        saref:observes ?room, ?tempProperty ;
                                        saref:hasResult ?tempResult .

                        ?tempResult rdf:type saref:PropertyValue ;
                                    saref:isValueOfProperty ?tempProperty ;
                                    saref:hasValue ?tempValue ;
                                    saref:isMeasuredIn ?tempUnit .

                        # 4) Water pressure measurement
                        ?heatPump saref:consistsOf ?waterAsset .
                        ?waterAsset rdf:type hco:HeatPumpWaterAsset ;
                                    saref:hasPropertyOfInterest ?waterPressureProperty .

                        ?waterPressureProperty rdf:type saref:PropertyOfInterest ;
                                                saref:hasPropertyKind saref4watr:FlowPressure .

                        ?heatPump saref:madeExecution ?wpObservation .
                        ?wpObservation rdf:type saref:Observation ;
                                        saref:observes ?waterAsset, ?waterPressureProperty ;
                                        saref:hasResult ?wpResult .

                        ?wpResult rdf:type saref:PropertyValue ;
                                    saref:isValueOfProperty ?waterPressureProperty ;
                                    saref:hasValue ?waterPressureValue ;
                                    saref:isMeasuredIn ?waterPressureUnit .

                        # 5) Current state
                        OPTIONAL {
                            ?heatPump saref:hasState ?state .
                            ?state rdf:type ?stateType .
                            ?state hco:hasStartTime ?startDateTime .
                            ?state hco:hasEndTime ?endDateTime .
                            # Optional value/unit if it exists
                            OPTIONAL {
                                ?state saref:hasResult ?stateResult .
                                ?stateResult saref:hasValue ?stateValue ;
                                            saref:isMeasuredIn ?stateUnit .
                            }
                        }
                    }`
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setTestData(data.results);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(true);
        }
    }

    const testRequests = async () => {
        console.log("Test data incoming...");
        
        try {
            await fetchTestData();
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
            if (testData != null) {
                console.log('testData:');
                console.log(testData);
            }
    }, [testData]);

    return (
        <>
            <div className="flex items-center justify-center">
                <span>Test page</span>
            </div>

            <br />
            
            <div>
                <p>We cannot show the test-data here yet. To see a structure of what should be displayed, click the button below, then press "Ctrl+Shift+I" and select the "Console" tab to see the test-data.</p>
            </div>

            <br />
            
            <div>
                <p>We kunnen de test-data not niet hier tonen. Om een structuur van wat getoond moet worden te zien, klik op de onderstaande knop, druk op "Ctrl+Shift+I" en selecteer vervolgens het tabblad "Console" om de test-data te zien.</p>
            </div>

            <br />

            <div className="flex items-center justify-center">
                <button onClick={testRequests} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Fetch Test Data
                </button>
            </div>
        </>
    )
}

export default Test
