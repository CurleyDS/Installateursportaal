import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './layouts/MainLayout';
import Test from './pages/Test';
import Districts from './pages/Districts';
import Home from './pages/Home';
import Details from './pages/Details';
import PumpSettings from './pages/PumpSettings';
import HomeSettings from './pages/HomeSettings';
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

                    <Route path="/districts" element={<Districts />} />
                    <Route index element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/:id" element={<Details />} />
                    <Route path="/:id/pump-settings" element={<PumpSettings />} />
                    <Route path="/:id/home-settings" element={<HomeSettings />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/malfunction" element={<Malfunction />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App
