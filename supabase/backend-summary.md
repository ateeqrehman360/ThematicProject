# Kinship MVP - Backend Documentation

## Overview

This document covers the backend architecture, security setup, database schema,and guidance for anyone continuing development on this project.

Tech Stack
----------

The backend uses Supabase as Baas (backend-as-a-service). This gives us a hosted PostgreSQL database, built in authentication, and Row level security (RLS) without needing a custom server or API.
The frontend (Vue) talks to Supabase directly using the JavaScript client from supabase/lib/supabaseClient.js.

Tables are linked to authenticated users via UUIDs.

## Final tables
- profiles
- friend_requests
- friendships
- blocks
- direct_messages
- posts
- post_comments
- post_likes
- reports

## Profiles
Profiles are linked to `auth.users(id)` and include:
- id
- username
- bio
- city
- area
- date_of_birth
- is_private
- tcg_interests
- avatar_url
- created_at

## Implemented backend features

### Profiles
- profile rows linked to authenticated users
- profile fetch/update structure aligned to schema

### Friend system
- send friend request
- accept friend request
- reject friend request
- friendship creation
- duplicate request prevention
- self-request prevention

### Blocking
- users can block other users
- blocking removes friendships
- blocking removes pending friend requests

### Posts
- create posts
- delete own posts
- fetch feed

### Comments
- add comments
- fetch comments

### Likes
- like posts
- unlike posts
- like counts available in feed query

### Messaging
- send direct messages
- fetch conversation between two users

### Discovery
- query profiles by city / area / interests
- exclude self
- exclude blocked users

## Functions created
- `accept_friend_request(request_id uuid)`
- `reject_friend_request(request_id uuid)`
- `send_friend_request(sender uuid, receiver uuid)`
- `send_message(sender uuid, receiver uuid, msg text)`
- `block_user(blocker uuid, blocked uuid)`

## Security
Row Level Security was enabled and manually configured for:
- profiles
- friend_requests
- friendships
- posts
- post_comments
- post_likes
- direct_messages
- blocks

Policies were created so users can only modify their own relevant data.

## Notes
This backend is MVP-complete for the core social features of the application:
- profiles
- discovery
- friends
- posts
- comments
- likes
- messages
- blocks


Where Config Lives
-----------
Supabase credentials are stored as environment variables. You will need a .env file in the project root with the following:


SUPABASE_URL=your_project_url_here

SUPABASE_ANON_KEY=your_anon_key_here

-You can find both of these values in the Supabase project dashboard under Project Settings -> API.

-Theres no need to commit your .env file to GitHub. This is already listed in .gitignore.

How to run locally
-----------
1. Clone the repository
2. Install dependencies:

   npm install

Create a .env file in the project root and add your SUPABASE_URL
and SUPABASE_ANON_KEY (just as before)

Run the development server:

   npm run dev
   
The app will connect to the hosted Supabase project automatically. There is no local database to set up.

Schema Overview
-----------
The database schema is defined in supabase/migrations/20260211045613_initial_schema.sql

Also referenced in FINAL_SCHEMA.md

Future Improvements
--------------
These features were considered but not implemented within the project timeframe:

Notifications — alert users when they receive a friend request or message

Moderation dashboard — a dedicated dashboard for moderators to review reports and keep the community safe.

Profile pictures — the ability for users to upload and customize their own avatars.

Private messaging restrictions — currently any user can message any other, this could be limited to friends only
