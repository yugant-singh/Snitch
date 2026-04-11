import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { handleVerifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("TOKEN:", token);

    if (!token) return;

    // 🔥 IMPORTANT: async function andar banao
    const verify = async () => {
      try {
        await handleVerifyEmail(token); // wait karega
        console.log("Verified success");
        navigate("/login"); // AFTER success
      } catch (err) {
        console.log("Verification failed", err);
      }
    };

    verify();

  }, []);

  return <h2>Verifying your email...</h2>;
}

export default VerifyEmailPage;