import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useCars(category?: string) {
  return useQuery({
    queryKey: ["cars", category],
    queryFn: () => api.getCars({ category }),
  });
}

export function useCar(slug: string) {
  return useQuery({
    queryKey: ["car", slug],
    queryFn: () => api.getCar(slug),
  });
}

export function useFeatured() {
  return useQuery({
    queryKey: ["featured"],
    queryFn: () => api.getFeatured(),
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => api.searchCars(query),
    enabled: query.length > 1,
  });
}