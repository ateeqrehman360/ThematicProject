# TCG Social Network Platform

Thematic Project for 6G5Z0023.

## Tech Stack
- Frontend: Vue
- Backend: Supabase (Auth, Postgres, RLS)

## Project Status
Initial planning and setup.

## Setup
Instructions to be added.



# Backend Architecture & Scope

## Backend Approach
The backend for this project uses Supabase as a backend-as-a-service solution. Supabase provides authentication, a PostgreSQL database, and Row Level Security (RLS), removing the need for a custom Express/Node API. This approach was chosen to reduce delivery risk and allow the team to focus on core functionality rather than infrastructure.

## Public vs Private Data
Public profile data includes information visible to other users, such as:
- display name / username
- short bio
- favourite TCG or game

Private data includes:
- authentication identifiers
- email address
- any moderation or report data

Access to private data is restricted using Supabase Row Level Security policies.

## Backend MVP Scope
The backend MVP includes:
- User authentication (email/password)
- User profiles
- User interests or collections
- Content posting / social interactions
- Basic connection or interaction features
- Safety features including block and report functionality

Advanced features such as notifications and moderation dashboards are considered future enhancements.

## Rationale
Using Supabase reduces development overhead and time risk, allowing the team to deliver a working minimum viable product within the unit timeframe. Security and access control are handled through database-level policies, supporting ethical and privacy considerations while keeping the architecture simple and maintainable.
