# Cred - Credit Repair Application

A modern web application built with Next.js for credit repair services, offering various tiers of service packages and comprehensive credit improvement solutions.

## Features

- Modern, responsive UI built with Next.js and TailwindCSS
- Multiple service tiers with different pricing options
- FAQ section for common credit repair questions
- Testimonials from satisfied clients
- Blog section for credit-related content
- Contact form for inquiries
- Secure payment processing with Authorize.net integration
- Account Onboarding
- Credit Repair Services
- Document Upload (ID verification, utility bills)
- User Dashboard

## Security Measures

This application implements robust security measures to protect user data:

### Data Encryption
- Client-side AES encryption for sensitive user data
- All PII (Personally Identifiable Information) is encrypted before transmission
- Support for both encryption and decryption of sensitive data
- SHA-256 hashing for data that doesn't need to be decrypted
- Encryption keys are stored in environment variables

### Secure Payment Processing
- Integration with Authorize.net for secure payment handling
- Client-side tokenization of credit card information
- PCI-compliant payment processing
- No credit card details stored on our servers
- SSL/TLS encryption for all payment transactions

### Secure Communication
- HTTPS-only API endpoints
- Secure form validation to prevent injection attacks
- API timeout configuration to prevent hanging connections
- Comprehensive error handling for failed requests
- Protection against common web vulnerabilities

### Document Security
- Secure document storage for uploaded identification
- Limited-time access URLs for uploaded documents
- Access control for sensitive document retrieval

## Tech Stack

- Next.js 15.1.7
- React 19
- TypeScript
- TailwindCSS
- Framer Motion for animations
- React Hook Form for form handling
- Zod for validation
- SWR for data fetching
- Authorize.net Accept.js for payment processing
- CryptoJS for client-side encryption

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm, yarn, or pnpm
- Authorize.net merchant account (for payment processing)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add necessary environment variables

> ⚠️ **Security Warning**: Never commit `.env` or `.env.local` files to version control. Make sure these files are included in your `.gitignore`.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

For HTTPS development server:
```bash
npm run dev:https
# or
yarn dev:https
# or
pnpm dev:https
```

Open [http://localhost:3000](http://localhost:3000) (or https://localhost:3001 for HTTPS) with your browser to see the result.

## Project Structure

```
src/
├── app/           # Next.js app directory
├── components/    # React components
│   ├── common/    # Reusable components
│   └── sections/  # Page sections (including OnboardingForm)
├── constants/     # Constants and configuration
├── data/          # Static data (FAQs, packages, etc.)
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
│   └── api.ts     # API client
├── scripts/       # Helper scripts
├── styles/        # Global styles
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
    └── encryption.ts # Encryption utilities
```

## Available Scripts

- `dev` - Runs the development server with Turbopack
- `dev:https` - Runs the development server with HTTPS support
- `build` - Builds the application for production
- `start` - Starts the production server
- `lint` - Runs ESLint for code linting
- `test` - Runs Jest tests (when configured)

## Payment Processing

This application uses Authorize.net for secure payment processing:

1. **Accept.js Integration**: We use Authorize.net's Accept.js library to tokenize credit card information on the client side
2. **Tokenization Flow**:
   - Card details are collected in the browser
   - Accept.js tokenizes the data and returns a data descriptor and data value
   - These tokens are sent to our server instead of actual card details
   - Our server uses these tokens to process payments through Authorize.net's API
3. **Testing**: In development, the application uses Authorize.net's sandbox environment

## Testing

### Payment Testing

For testing payments in the development environment:

- Use Authorize.net sandbox credentials
- Test card number: `4111 1111 1111 1111`
- Any future expiry date
- Any 3-digit CVV

### Unit and Integration Tests

Run the test suite with:

```bash
npm run test
# or
yarn test
```

## Troubleshooting

### Common Issues

1. **Payment Processing Errors**:
   - Verify that Authorize.net credentials are correctly set in environment variables
   - Check that Accept.js is loading properly (network requests in developer console)
   - Ensure you're using valid test card information in development

2. **Form Submission Issues**:
   - Check browser console for API errors
   - Verify that all required fields are completed
   - Ensure uploaded documents meet size and format requirements

3. **Environment Variables**:
   - Make sure all required environment variables are set
   - Restart the development server after changing environment variables

## Deployment

The application is optimized for deployment on Vercel. To deploy:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

For other platforms, ensure you have the necessary environment variables set and run:

```bash
npm run build
npm run start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com

# Security
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key

# Authorize.net Credentials
NEXT_PUBLIC_AUTHORIZE_LOGIN_ID=your-authorize-login-id
NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY=your-authorize-client-key

# Accept.js URLs
NEXT_PUBLIC_ACCEPTJS_PROD_URL=https://js.authorize.net/v1/Accept.js
NEXT_PUBLIC_ACCEPTJS_TEST_URL=https://jstest.authorize.net/v1/Accept.js
```

## Browser Compatibility

This application supports:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is private and proprietary. All rights reserved.

## Contact

[Contact information]
