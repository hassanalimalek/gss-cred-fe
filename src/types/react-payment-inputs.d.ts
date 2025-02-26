declare module 'react-payment-inputs' {
  export const PaymentInputsContainer: React.FC<any>;
  export function usePaymentInputs(): {
    getCardImageProps: (props: any) => any;
    getCardNumberProps: (props: any) => any;
    getExpiryDateProps: (props: any) => any;
    getCVCProps: (props: any) => any;
    wrapperProps: any;
    meta: {
      error: string | null;
      touched: boolean;
    };
  };
}

declare module 'react-payment-inputs/images' {
  const images: {
    [key: string]: string;
  };
  export default images;
}
