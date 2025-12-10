import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../../viewmodels';

const authVM = authViewModel;

interface PrivateRouteProps {
    roles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ roles }) => {
    if (!authVM.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && authVM.user && !roles.includes(authVM.user.role)) {
        return <div className="error-page">403 - Geen toegang</div>;
    }

    return <Outlet />;
});
