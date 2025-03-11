export interface Stat {
  number: string;
  text: string;
  symbol?: string;
}

export const stats: Stat[] = [
  { number: "1,000", text: "Items Removed" },
  { number: "200", text: "Record Removal" },
  { number: "99.8", text: "Success Rate", symbol: "%" },
  { number: "800", text: "Clients" },
  { number: "8", text: "Years of Experience" },
];