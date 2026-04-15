import { useCallback, useEffect, useState } from "react";
import { ngoService } from "../services/api";

export const useNgoData = () => {
  const [ngos, setNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNgos = useCallback(async () => {
    try {
      const data = await ngoService.getAll();
      setNgos(data);
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
    reload: loadNgos,
  };
};
