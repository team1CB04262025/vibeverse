# Vibeverse

A location-based review and recommendation app built with [Next.js](https://nextjs.org) that helps users discover and review places.

## Features

- AI-powered chat interface for creating place reviews
- Recommendation system for finding places based on user preferences
- Mobile-optimized web layout
- Persistent data storage using Orama

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Contains all the Next.js pages and routes
  - `landing1`, `landing2`: Different landing page versions
  - `recommendation`: Page for getting place recommendations
  - `visit`: Page for visiting and reviewing places
- `src/components`: Reusable UI components
- `src/db`: Database models and data access layer
- `src/lib`: Utility functions and shared code

## Data Models

The app uses two main data models:

- Places: Venue information such as name, location, type
- Reviews: User reviews with ratings for different aspects of a place

## Scripts

```bash
# Run the development server with Turbopack
npm run dev

# Build for production
npm run build

# Start the production server
npm run start

# Lint the codebase
npm run lint

# Seed the database with sample data
npm run seed
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
