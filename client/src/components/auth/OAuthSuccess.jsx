import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <center>
      Redirecting...
    </center>
  )
}

export default OAuthSuccess