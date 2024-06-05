import PropTypes from "prop-types";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { setModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("authData"));

  const hasAllowedRole = authData?.roles?.some((role) =>
    allowedRoles?.includes(role)
  );

  if (hasAllowedRole) {
    return <Outlet />;
  } else if (authData?.accessToken) {
    if (authData.roles.includes("admin")) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
    return null;
  } else {
    setModal(true);
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireAuth;
