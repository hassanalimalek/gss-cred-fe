# Cred - Credit Repair Application

A modern web application built with Next.js for credit repair services, offering various tiers of service packages and comprehensive credit improvement solutions.

## Features

- Modern, responsive UI built with Next.js and TailwindCSS
- Multiple service tiers with different pricing options
- FAQ section for common credit repair questions
- Testimonials from satisfied clients
- Blog section for credit-related content
- Contact form for inquiries
- Secure payment processing integration

## Tech Stack

- Next.js 15.1.7
- React 19
- TypeScript
- TailwindCSS
- Framer Motion for animations
- React Hook Form for form handling
- Zod for validation
- SWR for data fetching

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm, yarn, or pnpm

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

3. Create a `.env` file in the root directory and add necessary environment variables

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
├── constants/     # Constants and configuration
├── data/         # Static data (FAQs, packages, etc.)
├── hooks/        # Custom React hooks
├── lib/          # Utility libraries
├── scripts/      # Helper scripts
├── styles/       # Global styles
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

## Available Scripts

- `dev` - Runs the development server with Turbopack
- `dev:https` - Runs the development server with HTTPS support
- `build` - Builds the application for production
- `start` - Starts the production server
- `lint` - Runs ESLint for code linting

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

Create a `.env` file with the following variables:

```env
# Add your environment variables here
# Example:
# NEXT_PUBLIC_API_URL=https://api.example.com
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is private and proprietary. All rights reserved.
