import { useCallback, useEffect, useState } from "react";
import { ngoService } from "../services/api";

export const useNgoData = () => {
  const [ngos, setNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNgos = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await ngoService.getAll();
      setNgos(data);
    } catch (loadError) {
      setError("We could not load NGO data right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNgos();
  }, [loadNgos]);

  return {
    ngos,
    isLoading,
    error,
    reload: loadNgos,
  };
};
