-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS PROFILE TABLE (public by default)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  favourite_tcg text,
  is_private boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- USER INTERESTS (shortlist of favourite cards / tags)
create table user_interests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  interest text not null,
  created_at timestamptz default now(),
  unique (user_id, interest)
);

-- FRIEND REQUESTS
create type friend_request_status as enum ('pending', 'accepted', 'rejected');

create table friend_requests (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  status friend_request_status default 'pending',
  created_at timestamptz default now(),
  unique (sender_id, receiver_id)
);

-- FRIENDSHIPS (once accepted)
create table friendships (
  user_a uuid references profiles(id) on delete cascade,
  user_b uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_a, user_b)
);

-- BLOCKS
create table blocks (
  blocker_id uuid references profiles(id) on delete cascade,
  blocked_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (blocker_id, blocked_id)
);

-- POSTS (public to everyone)
create table posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  is_archived boolean default false,
  created_at timestamptz default now()
);

-- LIKES
create table post_likes (
  user_id uuid references profiles(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- COMMENTS
create table post_comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- DIRECT MESSAGES
create table direct_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- REPORTS (ADMIN ONLY)
create table reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references profiles(id) on delete cascade,
  reported_user_id uuid references profiles(id) on delete cascade,
  reason text not null,
  created_at timestamptz default now()
);


alter table profiles enable row level security;
alter table user_interests enable row level security;
alter table friend_requests enable row level security;
alter table friendships enable row level security;
alter table blocks enable row level security;
alter table posts enable row level security;
alter table post_likes enable row level security;
alter table post_comments enable row level security;
alter table direct_messages enable row level security;
alter table reports enable row level security;
