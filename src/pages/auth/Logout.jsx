import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/Authentication";

const Logout = () => {
  const { setTokens } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setTokens();
    navigate("/home", { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 500);

  return <>Logout Page</>;
};

export default Logout;