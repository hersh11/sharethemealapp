import { useCallback, useEffect, useState } from "react";
import { donationService } from "../services/api";

export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDonations = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await donationService.getAll();
      setDonations(data);
    } catch (loadError) {
      setError("We could not load your donation activity.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const createDonation = useCallback(async (payload) => {
    const createdDonation = await donationService.create(payload);
    setDonations((currentDonations) => [createdDonation, ...currentDonations]);
    return createdDonation;
  }, []);

  return {
    donations,
    isLoading,
    error,
    createDonation,
    reload: loadDonations,
  };
};
