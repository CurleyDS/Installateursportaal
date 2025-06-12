import { useState } from 'react'
import reactLogo from '../assets/react.svg'

function Home() {
    // const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Installateursportaal</h1>
            <div className="card">
                <p>Virtuele omgeving voor het Installateursportaal</p>
            </div>
        </>
    )
}

export default Home
