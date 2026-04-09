# Kinship MVP - Backend Summary

## Overview
This backend was implemented using Supabase (PostgreSQL + Auth + Row Level Security).

Authentication is handled by Supabase Auth. Application data is stored in PostgreSQL tables linked to authenticated users via UUIDs.

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
