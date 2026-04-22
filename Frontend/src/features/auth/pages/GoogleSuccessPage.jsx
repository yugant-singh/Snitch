import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../state/auth.slice"; // apna slice path lagao
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

function GoogleSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      const decoded = jwtDecode(token);
      
      dispatch(setUser({ user: decoded, token }));

      if(decoded.role === 'seller'){
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    }
  }, []);

  return <h2>Logging you in...</h2>;
}

export default GoogleSuccessPage;