import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './header/components/Header';
import BreadCrumbs from './common/components/BreadCrumbs';
import AuthRoutes from './routes/AuthRoutes';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import { useAuth } from './common/hooks/useAuth';
import CommonRoutes from './routes/CommonRoutes';

function App() {
  const auth = useAuth();
  const isAuthenticated = !!auth?.authToken;

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
      />

      {!isAuthenticated ? (
        <AuthRoutes />
      ) : (
        <>
          <Header />
          <BreadCrumbs />
          {auth?.role === 'admin' && <AdminRoutes />}
          {auth?.role === 'user' && <UserRoutes />}
          <CommonRoutes />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
