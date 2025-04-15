import './App.css';
import './index.css';

import BlockSelector from './components/BlockSelector/BlockSelector';
import CourseBigCards from './components/CourseBigCards/CourseBigCards';
import TitleHeader from './components/TitleHeader/TitleHeader';
import Courts from './pages/Courts/Courts';
import Extracurriculars from './pages/Extracurriculars/Extracurriculars';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Selections from './pages/Selections/Selections';
import Gyms from './pages/Gyms/Gyms';
import Equipment from './pages/Equipment/Equipment';
import PrivateRoute from './components/RestrictedRoute/PrivateRoute';
import Header from './components/Header/Header';
import BreadCrumbs from './components/BreadCrumbs/BreadCrumbs';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Register from './pages/Register/Register';
import Logout from './pages/Logout/Logout';
import { useAuth } from './hooks/useAuth';
import AccessDenied from './components/DenegatedAccess/DenegatedAccess';
import UserRoute from './components/RestrictedRoute/UserRoute';

const Layout = () => {
  const location = useLocation();
  const { authToken, role } = useAuth();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  if (!authToken || !role) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-3">
      <TitleHeader />
      {location.pathname !== '/' && <Header />}
      {location.pathname !== '/' && <BreadCrumbs />}
    </div>
  );
};

function App() {
  const { role } = useAuth();

  return (
    <BrowserRouter>
      <Layout />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          {role === 'user' && (
            <>
              <Route element={<UserRoute />}>
                <Route path="/talleres" element={<Extracurriculars />} />
                <Route path="/selecciones" element={<Selections />} />
                <Route path="/gimnasio" element={<Gyms />} />
                <Route path="/canchas" element={<Courts />} />
                <Route
                  path="/talleres/:extracurricularName"
                  element={<CourseBigCards />}
                />
                <Route
                  path="/canchas/:canchaName"
                  element={<BlockSelector />}
                />
                <Route path="/gimnasio/:gymName" element={<BlockSelector />} />
                <Route path="/gimnasio/Equipamiento" element={<Equipment />} />
              </Route>
            </>
          )}
          <Route path="/logout" element={<Logout />} />

          <Route
            path="/"
            element={
              <div className=" h-screen">
                <Home />
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
