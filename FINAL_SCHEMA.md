# Kinship MVP - Final Backend Schema (Supabase)

This is the final backend schema for the Kinship application using Supabase.

All frontend development must follow this schema.
Previous API-based schemas are deprecated and should not be used.

- User IDs are UUIDs (from Supabase Auth)
- Data is stored in PostgreSQL tables (not custom APIs)
- Field names must match exactly as defined here


MVP Schema
 
Auth
 
Handled by Supabase Auth, not custom endpoints:
• signup
• login
• logout
 
User ID comes from auth.users.id as a UUID string.
 
Main profile shape
type Profile = {
 id: string
 username: string
 bio: string
 city: string | null
 area: string | null
 date_of_birth: string
 is_private: boolean
 tcg_interests: string[]
 avatar_url: string | null
 created_at: string
}
 
Notes
• id is a UUID, not a number
• use username, not fullName
• use city and area, not full address/location
• use is_private, not isPrivateProfile
• use tcg_interests, not tcgInterests in DB payloads
•	profiles.id must match the authenticated Supabase user ID
 
Tables
 
profiles
id uuid primary key references auth.users(id)
username text unique not null
bio text
city text
area text
date_of_birth date not null
is_private boolean default false
tcg_interests text[] default '{}'
avatar_url text
created_at timestamptz default now()
 
friend_requests
id uuid primary key default gen_random_uuid()
sender_id uuid references profiles(id)
receiver_id uuid references profiles(id)
status text check (status in ('pending','accepted','rejected')) default 'pending'
created_at timestamptz default now()
 
friendships
id uuid primary key default gen_random_uuid()
user1_id uuid references profiles(id)
user2_id uuid references profiles(id)
created_at timestamptz default now()
 
blocks default gen_random_uuid()
id uuid primary key 
blocker_id uuid references profiles(id)
blocked_id uuid references profiles(id)
created_at timestamptz default now()
 
direct_messages
id uuid primary key default gen_random_uuid()
sender_id uuid references profiles(id)
receiver_id uuid references profiles(id)
content text not null
created_at timestamptz default now()

posts
id uuid primary key default gen_random_uuid()
user_id uuid references profiles(id)
content text not null
created_at timestamptz default now()
 
post_likes
id uuid primary key default gen_random_uuid()
post_id uuid references posts(id)
user_id uuid references profiles(id)
created_at timestamptz default now()
 
post_comments 
id uuid primary key
post_id uuid references posts(id)
user_id uuid references profiles(id)
content text not null
created_at timestamptz default now()
 
reports
id uuid primary key default gen_random_uuid()
reporter_id uuid references profiles(id)
reported_user_id uuid references profiles(id)
reason text not null
created_at timestamptz default now()
 
Frontend field naming rules
 
Use these names in frontend model
• id
• username
• bio
• city
• area
• date_of_birth
• is_private
• tcg_interests
 
Do not assume these old names
• userId
• fullName
• location
• address
• isPrivateProfile
 
Key rules frontend should follow
• Profile IDs are UUID strings
• Auth user must have a matching row in profiles
• Discovery should use:
o city
o area
o tcg_interests
• Private profile flag is is_private
• Messaging uses direct_messages
• Friend system uses:
o friend_requests
o friendships
• Blocking uses blocks
•	Posts use posts
•	Comments use post_comments
•	Likes use post_likes
 
Rules:

Profiles
	•	A signed-in user must create a matching profiles row using their own auth UUID as profiles.id
	•	Users can only create/update their own profile
	•	Email is handled by Supabase Auth and is not part of the public profile table

Friend requests
	•	Users cannot send friend requests to themselves
	•	Duplicate friend requests between the same sender and receiver are not allowed
	•	Friend requests can be accepted or rejected
	•	Accepted requests create a friendship row

Friendships
	•	Users cannot be friends with themselves
	•	Friendships should be stored as one normalized pair

Blocking
	•	Users cannot block themselves
	•	Blocking removes any friendship between the two users
	•	Blocking removes any pending friend requests between the two users
	•	Blocked users should not appear in discovery
	•	Blocked users should not be able to message each other

Direct messages
	•	Users cannot message themselves
	•	Messages are only between two profiles
	•	Conversation queries should use direct_messages

Posts / comments / likes
	•	Posts belong to one user
	•	Comments belong to one post and one user
	•	Likes belong to one post and one user
	•	A user should only be able to like a given post once


Uniqueness rules
	•	profiles.username must be unique
	•	friend_requests (sender_id, receiver_id) must be unique
	•	friendships must be unique per normalized user pair
	•	post_likes (post_id, user_id) must be unique
