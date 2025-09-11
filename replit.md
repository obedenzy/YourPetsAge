# Overview

Pet Age Translator is a full-stack web application that calculates pet ages using veterinary precision and presents them through a cosmic-themed interface. The application allows users to calculate their pets' ages in human years, create pet profiles, participate in community features like forums and meetups, and access premium features through a token-based system. The platform combines practical pet age calculations with gamification elements and social features to create an engaging pet owner community.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with a clean, declarative approach
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming and cosmic design elements
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **API Design**: RESTful API with organized route handlers in `/server/routes.ts`
- **Data Layer**: In-memory storage implementation (`MemStorage`) for development with interface-based design for easy database migration
- **Session Management**: Express sessions with PostgreSQL session store configuration
- **Development**: Hot module replacement and error overlay integration with Replit-specific tooling

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM with type-safe schema definitions
- **ORM**: Drizzle ORM with schema-first approach and automatic migration generation
- **Schema**: Comprehensive data models for users, pets, meetups, forum posts, achievements, and timeline entries
- **Local Storage**: Browser localStorage for client-side data persistence and offline functionality

## Authentication and Authorization
- **Session-based**: Express sessions with PostgreSQL session storage
- **Token System**: Internal token economy for premium features with user balance tracking
- **Premium Integration**: Stripe integration for subscription and token purchases
- **User Management**: User profiles with email, tokens, and premium status tracking

## External Service Integrations
- **Payment Processing**: Stripe for handling subscriptions and token purchases
- **Database**: Neon Database (PostgreSQL) for production data storage
- **Development Tools**: Replit-specific integrations for development environment
- **Font Loading**: Google Fonts for typography (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Icons**: Font Awesome for consistent iconography throughout the application

# External Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **@stripe/stripe-js** and **@stripe/react-stripe-js**: Stripe payment integration
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM and migration tools
- **wouter**: Lightweight React router
- **react-hook-form** and **@hookform/resolvers**: Form handling with validation
- **zod**: Runtime type validation and schema definition
- **tailwindcss**: Utility-first CSS framework
- **express**: Node.js web application framework
- **connect-pg-simple**: PostgreSQL session store for Express