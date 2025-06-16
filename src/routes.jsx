import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar, Navbar } from './components/NavComponent';
import Home from './pages/Home';

const AppRoutes = () => (
    <Router>
        <Sidebar />
        
        <Routes>
            <Route path="/" element={<><Navbar /><Home /></>} />
        </Routes>
        
    </Router>
);

export default AppRoutes;
