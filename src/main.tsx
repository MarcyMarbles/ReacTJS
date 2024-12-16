import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "@ezgrid/grid-core/styles.css"
import "@ezgrid/grid-core/icons.css"
import './index.css'
import LoginPage from './LoginPage';
import App from './App';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Make sure the DOM element with id 'root' exists.");
}

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<App />} />
    </Routes>
  </Router>
);
