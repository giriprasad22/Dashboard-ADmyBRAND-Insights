# ADmyBRAND Insights Dashboard

## Overview

This is a marketing analytics dashboard application built with React, Express, and PostgreSQL. The application provides comprehensive insights into digital marketing campaigns, including metrics tracking, data visualization, and campaign management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: PostgreSQL-based sessions with connect-pg-simple

## Key Components

### Data Layer
- **Database**: PostgreSQL configured through Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definitions in `shared/schema.ts`
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

### API Endpoints
- **Metrics**: `/api/metrics` - Dashboard overview metrics
- **Campaigns**: `/api/campaigns` - CRUD operations for marketing campaigns
- **Charts**: `/api/charts/*` - Chart data for visualizations

### UI Components
- **Dashboard**: Main analytics overview with metrics cards and charts
- **Data Tables**: Sortable, filterable campaign listings with pagination
- **Charts**: Interactive visualizations using Recharts library
- **Theme System**: Light/dark mode toggle with CSS custom properties

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and validation
3. **Storage Layer**: Abstracted storage interface manages data persistence
4. **Database**: PostgreSQL stores campaigns, metrics, and chart data
5. **Real-time Updates**: Simulated real-time metrics with periodic refresh

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **Database**: Drizzle ORM, Neon PostgreSQL serverless
- **UI Components**: Radix UI primitives for accessibility
- **Validation**: Zod for schema validation and type safety
- **Charts**: Recharts for data visualization

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **ESBuild**: Backend bundling for production
- **Tailwind CSS**: Utility-first styling framework

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Environment-based PostgreSQL connection

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Static Assets**: Express serves built frontend files
- **Database**: PostgreSQL with connection pooling

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Session Storage**: PostgreSQL-backed sessions for scalability
- **CORS**: Configured for cross-origin requests in development

The application is designed for easy deployment to platforms like Replit, with proper environment variable management and database provisioning through Drizzle migrations.