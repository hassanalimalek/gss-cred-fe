import React from 'react';

export interface CreditCardPreviewProps {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

/**
 * A component that renders a visual credit card preview that updates based on user input
 */
export const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({ 
  cardNumber, 
  expiryDate, 
  cvc 
}) => {
  // Format the card number with proper spacing
  const formatDisplayCardNumber = () => {
    if (!cardNumber) return "•••• •••• •••• ••••";
    // Pad up to 16 for a consistent look, then space every 4 digits
    const formatted = cardNumber
      .padEnd(16, "•")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    return formatted;
  };

  // Determine card type based on first digits
  const getCardType = () => {
    if (cardNumber.startsWith("4")) return "visa";
    if (cardNumber.startsWith("5")) return "mastercard";
    if (cardNumber.startsWith("3")) return "amex";
    if (cardNumber.startsWith("6")) return "discover";
    return "default";
  };

  const cardType = getCardType();

  return (
    <div className="relative w-[410px] h-[220px] rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white shadow-lg overflow-hidden">
      {/* Card type (brand logo) in the top right */}
      <div className="absolute top-6 right-6">
        {cardType === "visa" && (
          <span className="text-xl font-bold italic">VISA</span>
        )}
        {cardType === "mastercard" && (
          <div className="flex">
            <div className="w-8 h-8 bg-red-500 rounded-full opacity-80 -mr-4"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full opacity-80"></div>
          </div>
        )}
        {cardType === "amex" && <span className="text-xl font-bold">AMEX</span>}
        {cardType === "discover" && (
          <span className="text-xl font-bold">DISCOVER</span>
        )}
      </div>

      {/* Card chip */}
      <div className="w-12 h-10 bg-yellow-300 rounded-md mb-6 flex items-center justify-center">
        <div className="w-10 h-8 border-2 border-yellow-600 rounded-md"></div>
      </div>

      {/* Card number display */}
      <div className="text-2xl mb-6 font-mono tracking-wider">
        {formatDisplayCardNumber()}
      </div>

      {/* Expiry date and CVV */}
      <div className="flex justify-between items-center">
        {/* Expiry date */}
        <div>
          <div className="text-xs uppercase text-gray-200 mb-1">Expires</div>
          <div className="font-medium">{expiryDate || "MM/YY"}</div>
        </div>
        {/* CVV */}
        <div>
          <div className="text-xs uppercase text-gray-200 mb-1">CVV</div>
          <div className="font-medium">{cvc || "***"}</div>
        </div>
      </div>

      {/* Subtle security pattern background */}
      <div className="absolute inset-0 bg-white opacity-5">
        <div className="w-full h-full bg-grid-slate-200/10"></div>
      </div>
    </div>
  );
}; 