import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '@constants/route';
import { ROLE } from '@constants/common';
import LoadingPage from '@pages/LoadingPage';
import { RootState } from '@redux/store/store';

interface PrivateRouteProps {
    allowedRoles: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
    const { userId, userRole } = useSelector((state: RootState) => state.auth);

    const isLoading = userId === null;

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!allowedRoles.includes(userRole) && userRole !== ROLE.ADMIN) {
        return <Navigate to={ROUTES.AUTH.UNAUTHORIZED} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;