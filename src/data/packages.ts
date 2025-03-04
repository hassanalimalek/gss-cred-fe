export interface Package {
  name: string;
  price: number;
}

export const packages: Package[] = [
  { name: "Tier 1", price: 2199 },
  { name: "Tier 2", price: 2699 },
  { name: "Tier 3", price: 3199 },
];