import { useState, useEffect } from "react";

export function useIsLogin() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  return isLogin;
}