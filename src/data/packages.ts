export interface Package {
  name: string;
  price: number;
}

export const packages: Package[] = [
  { name: "Tier 1", price: 3499 },
  { name: "Tier 2", price: 5000 },
  { name: "Custom", price: 1 },
];
