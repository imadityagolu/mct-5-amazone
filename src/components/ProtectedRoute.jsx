import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CgSearchLoading } from "react-icons/cg";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(timer);
  }, []); //mounting

  if (isLoading) return <h1 className="min-h-screen bg-gray-200 flex items-center justify-center px-4 sm:px-6"><CgSearchLoading /> Loading...</h1>;

  if (!user) return navigate("/login");

  return children;
}

export default ProtectedRoute;
