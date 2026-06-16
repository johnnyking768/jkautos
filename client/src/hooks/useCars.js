import { useCallback, useEffect, useState } from "react";
import { carService } from "../services/carService";

export function useCars(initialFilters = {}) {
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCars = useCallback(async (filters = initialFilters) => {
    setLoading(true);
    try {
      const data = await carService.getCars(filters);
      setCars(data.cars || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(() => carService.getFeatured(), []);
  const fetchSingle = useCallback((slug) => carService.getSingle(slug), []);
  const fetchBrands = useCallback(() => carService.getBrands(), []);

  useEffect(() => {
    fetchCars(initialFilters);
  }, []);

  return { cars, total, page, totalPages, loading, error, fetchCars, fetchFeatured, fetchSingle, fetchBrands };
}
