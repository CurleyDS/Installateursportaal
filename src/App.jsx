import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './layouts/MainLayout';
import Test from './pages/Test';
import District from './pages/District';
import Home from './pages/Home';
import Details from './pages/Details';
import DetailsSettings from './pages/DetailsSettings';
import Settings from './pages/Settings';
import Maintenance from './pages/Maintenance';
import Malfunction from './pages/Malfunction';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Main />}>
                    <Route path="/test" element={<Test />} />

                    <Route path="/wijken" element={<District />} />
                    <Route index element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/:id" element={<Details />} />
                    <Route path="/:id/Instellingen" element={<DetailsSettings />} />
                    <Route path="/Onderhoud" element={<Maintenance />} />
                    <Route path="/Storingen" element={<Malfunction />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App
