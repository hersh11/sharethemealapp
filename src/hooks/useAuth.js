import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/api";

const initialState = {
  isLoading: true,
  user: null,
};

export const useAuth = () => {
  const [state, setState] = useState(initialState);

  const loadUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setState({ isLoading: false, user });
    } catch (error) {
      setState({ isLoading: false, user: null });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setState({ isLoading: false, user: null });
    }
  }, []);

  return {
    ...state,
    loginWithGoogle: authService.loginWithGoogle,
    logout,
    refreshUser: loadUser,
  };
};
