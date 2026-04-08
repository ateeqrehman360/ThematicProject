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
 created_at: string
}
 
Notes
• id is a UUID, not a number
• use username, not fullName
• use city and area, not full address/location
• use is_private, not isPrivateProfile
• use tcg_interests, not tcgInterests in DB payloads
 
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
created_at timestamptz default now()
 
friend_requests
id uuid primary key
sender_id uuid references profiles(id)
receiver_id uuid references profiles(id)
status text check (status in ('pending','accepted','rejected')) default 'pending'
created_at timestamptz default now()
 
friendships
id uuid primary key
user1_id uuid references profiles(id)
user2_id uuid references profiles(id)
created_at timestamptz default now()
 
blocks
id uuid primary key
blocker_id uuid references profiles(id)
blocked_id uuid references profiles(id)
created_at timestamptz default now()
 
direct_messages
id uuid primary key
sender_id uuid references profiles(id)
receiver_id uuid references profiles(id)
content text not null
created_at timestamptz default now()
posts
id uuid primary key
user_id uuid references profiles(id)
content text not null
created_at timestamptz default now()
 
post_likes
id uuid primary key
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
id uuid primary key
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
 
