export type Category = "JDM" | "SUPERCAR" | "CLASSIC";

export interface Car {
  id: string;
  name: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  endYear?: number;
  category: Category;
  engine: string;
  displacement?: number;
  horsepower?: number;
  torque?: number;
  transmission?: string;
  drivetrain?: string;
  weight?: number;
  zeroToSixty?: number;
  topSpeed?: number;
  unitsProduced?: number;
  tagline?: string;
  story?: string;
  funFacts: string[];
  tags: string[];
  images: Image[];
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  carId: string;
  url: string;
  source: string;
  attribution?: string;
  isPrimary: boolean;
}

export interface Variant {
  id: string;
  carId: string;
  name: string;
  horsepower?: number;
  notes?: string;
}

export interface Spotlight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  carSlugs: string[];
  createdAt: string;
  updatedAt: string;
}