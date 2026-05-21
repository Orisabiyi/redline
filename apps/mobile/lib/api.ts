import axios from "axios";
import { Car, Spotlight } from "../types";

const API_URL =
  __DEV__ ? "http://localhost:5000/api/v1" : "https://api.redline.app/api/v1";

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
  },
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export const api = {
  getCars: (params?: { category?: string; page?: number; limit?: number }) =>
    client.get<never, { cars: Car[]; total: number }>("/cars", { params }),

  getCar: (slug: string) => client.get<never, Car>(`/cars/${slug}`),

  searchCars: (q: string) =>
    client.get<never, Car[]>("/cars/search", { params: { q } }),

  getSpotlights: () => client.get<never, Spotlight[]>("/spotlights"),

  getSpotlight: (id: string) =>
    client.get<never, Spotlight>(`/spotlights/${id}`),

  getFeatured: () => client.get<never, Car[]>("/cars/featured"),
};
