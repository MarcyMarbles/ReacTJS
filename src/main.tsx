import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "@ezgrid/grid-core/styles.css"
import "@ezgrid/grid-core/icons.css"
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App';
import ReactDOM from 'react-dom/client';
import AdminPage from './components/auth/AdminPage';
import RegisterSuccess from './components/auth/RegisterSuccess';
import Layout from './Layout';
import ConfirmPage from './components/auth/ConfirmPage';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Make sure the DOM element with id 'root' exists.");
}

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/admin" element={<AdminPage />}/>
          <Route path='/confirm' element={<ConfirmPage/>}/>
          <Route path='/successful' element={<RegisterSuccess/>}/>
        </Route>
      </Routes>
    </Router>
  </Provider>
);
