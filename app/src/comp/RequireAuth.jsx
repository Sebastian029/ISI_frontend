import PropTypes from "prop-types";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const RequireAuth = ({ allowedRoles }) => {
  const { setModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("authData"));

  const hasAllowedRole = authData?.roles?.some((role) =>
    allowedRoles?.includes(role)
  );

  useEffect(() => {
    if (!hasAllowedRole && authData?.accessToken) {
      if (authData.roles.includes("admin")) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else if (!authData?.accessToken) {
      setModal(true);
    }
  }, [hasAllowedRole, authData, navigate, setModal]);

  if (hasAllowedRole) {
    return <Outlet />;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireAuth;
