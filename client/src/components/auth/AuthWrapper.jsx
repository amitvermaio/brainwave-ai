import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import Spinner from '../common/Spinner';

const AuthWrapper = () => {
  const location = useLocation();
  const { isAuthenticated, status, token } = useSelector((state) => state.auth);

  const isCheckingAuth = status === 'loading' || (token && !isAuthenticated && status === 'idle');

  if (isCheckingAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default AuthWrapper