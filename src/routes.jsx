import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/NavComponent';
import District from './pages/District';
import Home from './pages/Home';
import Details from './pages/Details';

const AppRoutes = () => (
    <Router>
        <Sidebar />
        
        <Routes>
            <Route path="/wijken" element={<District />} />
            <Route path="/" element={<Home />} />
            <Route path="/Details" element={<Details />} />
        </Routes>
        
    </Router>
);

export default AppRoutes;
