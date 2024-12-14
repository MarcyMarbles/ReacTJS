import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "@ezgrid/grid-core/styles.css"
import "@ezgrid/grid-core/icons.css"
import './index.css'
import App from './App.jsx'
import LoginPage from "./LoginPage.jsx";

createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<App />} />
        </Routes>
    </Router>
)
