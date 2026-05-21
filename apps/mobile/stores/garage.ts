import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

interface GarageStore {
  savedCars: string[]; // array of slugs
  collections: Record<string, string[]>; // collection name → slugs
  saveCar: (slug: string) => void;
  removeCar: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  createCollection: (name: string) => void;
  addToCollection: (collection: string, slug: string) => void;
}

export const useGarage = create<GarageStore>()(
  persist(
    (set, get) => ({
      savedCars: [],
      collections: {},
      saveCar: (slug) =>
        set((s) => ({
          savedCars: s.savedCars.includes(slug)
            ? s.savedCars
            : [...s.savedCars, slug],
        })),
      removeCar: (slug) =>
        set((s) => ({
          savedCars: s.savedCars.filter((s) => s !== slug),
        })),
      isSaved: (slug) => get().savedCars.includes(slug),
      createCollection: (name) =>
        set((s) => ({
          collections: { ...s.collections, [name]: [] },
        })),
      addToCollection: (collection, slug) =>
        set((s) => ({
          collections: {
            ...s.collections,
            [collection]: [...(s.collections[collection] || []), slug],
          },
        })),
    }),
    {
      name: "redline-garage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);