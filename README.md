# Kinship - Local TCG Community Platform

A hyper-local community discovery and social platform for Trading Card Game (TCG) collectors and players.

## Features

- **Discovery**: Find TCG collectors and players near you
- **Social Feed**: Share posts about your collection and connect with others
- **Messaging**: Direct messaging with friends (limited messages for non-friends)
- **Friend Management**: Send and receive friend requests
- **Profile Management**: Showcase your TCG interests and favorite cards
- **Events & Locations**: Discover local TCG events and shops

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + Database + Storage)
- **Language**: TypeScript

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
  assets/              # Static assets
  components/          # Reusable Vue components
    ui/               # Shared UI primitives
    feed/             # Post and feed components
    profile/          # Profile components
    messaging/        # Chat and messaging components
    discovery/        # Discovery and search components
    friends/          # Friend management components
    safety/           # Safety and reporting tools
  views/              # Page-level components
  router/             # Vue Router configuration
  stores/             # Pinia store definitions
  composables/        # Reusable composition functions
  services/           # API and external service calls
  types/              # TypeScript type definitions
  utils/              # Utility functions
  App.vue             # Root component
  main.ts             # Application entry point
  index.css           # Global styles
```

## Key Concepts

### Authentication
- Authentication is handled via Supabase Auth
- User sessions are managed in the `authStore`
- Protected routes require authentication via Vue Router guards

### State Management
- Pinia stores manage application state
- Each feature has its own store (auth, user, feed, messages, etc.)
- Services handle all API calls, stores manage state

### Services
- All backend calls go through service modules
- Services never call other services or stores
- Services are pure and testable

### Message Limiting
- Non-friends can send max 5 messages (enforced client-side)
- Friends have unlimited messages
- Blocked users cannot send messages

## API Endpoints

The application expects the following endpoints:

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /users/{user_id}` - Get user profile
- `PATCH /users/{user_id}` - Update user profile
- `GET /search` - Search users, events, stores
- `GET /feed` - Get posts feed
- `POST /posts` - Create a post
- `POST /posts/{post_id}/likes` - Like a post
- `POST /messages` - Send message
- `GET /messages/{user_id}` - Get messages with user
- `GET /friends` - Get friends list
- `POST /friends/requests` - Send friend request
- And more...

## Development

### Running Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
