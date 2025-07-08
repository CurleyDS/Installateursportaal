import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './layouts/Main';
import District from './pages/District';
import Home from './pages/Home';
import Details from './pages/Details';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Main />}>
                    <Route path="/wijken" element={<District />} />
                    <Route index element={<Home />} />
                    <Route path="/:id" element={<Details />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App
