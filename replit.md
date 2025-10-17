# Overview

Shopee Delivery Partners is a Brazilian delivery driver recruitment platform that streamlines the digital onboarding process. The application allows delivery partners to register, provide vehicle information, and complete payment for safety equipment kits through a PIX payment gateway. It includes Facebook Pixel integration for conversion tracking and supports multiple deployment strategies (Heroku, Netlify, Vercel).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React with TypeScript for type safety and component-based UI
- Wouter for lightweight client-side routing
- Vite as the build tool and development server
- Tailwind CSS (v4) with shadcn/ui component library for styling
- TanStack React Query for server state management

**Design Decisions:**
- Component-based architecture with reusable UI components in `/client/src/components`
- Custom hooks for shared logic (scroll management, toast notifications)
- Form validation using React Hook Form with Zod resolvers
- Responsive design with mobile-first approach

**Routing Strategy:**
- Client-side routing handled by Wouter
- Main routes: Home (`/`), Registration (`/cadastro`), Payment (`/payment`), Success (`/success`)
- SPA architecture with fallback routing to `index.html` for all paths

## Backend Architecture

**Server Framework:**
- Express.js as the primary HTTP server
- ES modules (`"type": "module"` in package.json)
- Multiple server configurations for different deployment environments

**API Design:**
- RESTful API endpoints under `/api/*` prefix
- CORS configured to allow cross-origin requests from frontend domains
- JSON-based request/response format
- Middleware stack: compression, CORS, JSON body parsing

**Key Endpoints:**
- `/api/regions` - Fetch available delivery regions
- `/api/proxy/for4payments/*` - Payment gateway proxy endpoints
- `/api/vehicle-info/:plate` - Vehicle information lookup
- `/api/check-ip-status` - IP ban status checking

**Error Handling:**
- Centralized error middleware for consistent error responses
- Request logging with duration tracking
- Status code standardization (4xx for client errors, 5xx for server errors)

## Data Storage

**Database:**
- Drizzle ORM configured for PostgreSQL
- Schema defined in `/shared/schema.ts`
- Support for Neon serverless PostgreSQL via `@neondatabase/serverless`
- Optional database - application can run with mock data if `DATABASE_URL` not provided

**Schema Design:**
- User registration data (name, CPF, email, phone, vehicle info)
- Payment transaction tracking
- IP ban list for security
- Region/vacancy information

**Storage Strategy:**
- In-memory storage for development (Map-based payment store)
- PostgreSQL for production persistence
- Drizzle migrations in `/migrations` directory

## External Dependencies

**Payment Gateway:**
- **4m Pagamentos API** for PIX payment processing (October 2025 migration)
- Integration via TypeScript service (`server/payment.ts`)
- Environment variable: `FOUR_M_PAGAMENTOS_API_KEY` (server-side)
- Optional frontend direct integration: `VITE_FOUR_M_PAGAMENTOS_API_KEY`
- **API Endpoints:**
  - POST `https://app.4mpagamentos.com/api/v1/payments` - Create PIX transaction
  - GET `https://app.4mpagamentos.com/api/v1/transactions/{transactionId}` - Check payment status (public endpoint)
- **Payment Status Polling:**
  - Automatic polling every 5 seconds to check payment confirmation
  - Stops on terminal states: `paid`, `expired`, `cancelled`
  - Facebook Pixel event triggered on payment confirmation
- Transaction tracking to prevent duplicate charges
- Legacy: For4Payments integration (deprecated, files kept for reference)

**Email Service:**
- SendGrid for transactional emails
- API key: `SENDGRID_API_KEY`
- Email confirmation on registration approval

**Analytics & Tracking:**
- Facebook Pixel integration for conversion tracking
- Pixel ID: `VITE_FACEBOOK_PIXEL_ID`
- Events tracked: PageView, Lead, Purchase, CompleteRegistration

**Vehicle Information:**
- WDAPI2 integration for Brazilian vehicle data lookup
- API endpoint: `https://wdapi2.com.br/consulta/{plate}`
- Fallback to manual entry if API unavailable

**IP Geolocation:**
- IPInfo.io API for location tracking (no API key required)
- Used for security and user behavior analysis

## Deployment Architecture

**Multiple Deployment Strategies:**

1. **Heroku (Full Stack):**
   - Vite in development mode via `heroku-vite-server-standalone.js`
   - Environment: `NODE_ENV=development`
   - Port configuration via `process.env.PORT`
   - Custom Procfile configurations for different setups

2. **Static Hosting (Netlify/Vercel) + API Backend:**
   - Frontend: Static files served from `dist/public`
   - Backend: Separate Heroku deployment for API
   - CORS configured for cross-origin API calls
   - Configuration files: `netlify.toml`, `vercel.json`

3. **Replit Development:**
   - Integrated development environment
   - Cartographer plugin for visual debugging
   - Hot module replacement (HMR) enabled

**Build Process:**
- Frontend: `vite build` outputs to `dist/public`
- Backend: `esbuild` bundles server to `dist/index.js`
- Asset optimization with long-term caching headers
- Compression middleware for production

**Security Measures:**
- IP-based ban system with transaction tracking
- CORS whitelist for allowed origins
- Mobile device detection to prevent desktop scraping
- Never-ban IP list for legitimate development/admin access
- Rate limiting on payment transactions

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `FOUR_M_PAGAMENTOS_API_KEY` - Payment gateway API key (server-side, required)
- `VITE_FOUR_M_PAGAMENTOS_API_KEY` - Payment gateway API key (optional, for direct frontend calls)
- `SENDGRID_API_KEY` - Email service authentication
- `VITE_FACEBOOK_PIXEL_ID` - Analytics tracking ID
- `PORT` - Server port (Heroku-provided)
- `NODE_ENV` - Environment flag (development/production)