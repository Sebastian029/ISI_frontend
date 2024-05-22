import PropTypes from "prop-types";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, setModal } = useAuth();

  const location = useLocation();

  const hasAllowedRole = auth?.roles?.some((role) =>
    allowedRoles?.includes(role)
  );

  if (hasAllowedRole) {
    return <Outlet />;
  } else if (auth?.accessToken) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else {
    setModal(true);
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireAuth;
