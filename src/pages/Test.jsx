import { useState, useEffect } from 'react'

function Test() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
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
