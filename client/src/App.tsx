import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './header/components/Header';
import BreadCrumbs from './common/components/BreadCrumbs';
import AuthRoutes from './routes/AuthRoutes';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <BreadCrumbs />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
      />
      <AuthRoutes />
      <UserRoutes />
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;
