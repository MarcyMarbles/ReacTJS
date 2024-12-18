import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "@ezgrid/grid-core/styles.css"
import "@ezgrid/grid-core/icons.css"
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AuthPage from './components/auth/AuthPage';
import App from './App';
import ReactDOM from 'react-dom/client';
import AdminPage from './components/auth/AdminPage';
import RegisterSuccess from './components/auth/RegisterSuccess';
import Layout from './Layout';
import ConfirmPage from './components/auth/ConfirmPage';
import { Provider } from 'react-redux';
import { store } from './store';
import Profile from './components/profile/Profile';
import Feed from './components/news/Feed';
import CreatePost from './components/news/CreatePost';
import Friends from "./components/profile/Friends";

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
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<App />} />
          <Route path="/admin" element={<AdminPage />}/>
          <Route path='/confirm' element={<ConfirmPage/>}/>
          <Route path='/successful' element={<RegisterSuccess/>}/>
          <Route path='/profile/:username' element={<Profile/>}/>
          <Route path='/feed' element={<Feed/>}/>
          <Route path='/friends' element={<Friends/>}/>
        </Route>
      </Routes>
    </Router>
  </Provider>
);
