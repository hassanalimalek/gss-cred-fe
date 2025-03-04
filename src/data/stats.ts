export interface Stat {
  number: string;
  text: string;
  symbol?: string;
}

export const stats: Stat[] = [
  { number: "3,200", text: "Negative Items Removed" },
  { number: "1,430", text: "Satisfied Clients" },
  { number: "100", text: "Success Rate", symbol: "%" },
  { number: "6", text: "Years of Experience" },
];