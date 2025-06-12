import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavComponent';
import Home from './pages/Home';

const AppRoutes = () => (
    <Router>
        <Navbar />
        
        <div class="p-4 ml-64">
            <div class="p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </div>
        
    </Router>
);

export default AppRoutes;
