import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function GoogleSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    console.log("TOKEN:", token);

    if (token) {
      // 👉 yaha tum token store kar sakte ho (redux / localStorage)
      
      navigate("/"); // home pe bhej do
    }
  }, []);

  return <h2>Logging you in...</h2>;
}

export default GoogleSuccessPage;