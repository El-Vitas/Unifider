import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import UserRoutes from './routes/UserRoutes';
import Header from './header/components/Header';
import BreadCrumbs from './common/components/BreadCrumbs';

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
            <UserRoutes />
        </BrowserRouter>
    );
}

export default App;
