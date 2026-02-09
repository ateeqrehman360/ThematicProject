# Backend Requirements (TCG Friend-Finding / Matchmaker App)

## 1. Overview
This document captures the backend requirements for our friend-finding application themed around Trading Card Games (TCG). The app aims to reduce social isolation by helping users discover and connect with others who share similar interests, with optional local posts to encourage community engagement.

**Backend platform:** Supabase (Auth + PostgreSQL + Row Level Security (RLS))  
**Owner:** Ateeq (Backend Lead) – responsible for keeping this document in sync with agreed scope changes.

---

## 2. Core Product Decisions
- The application is a **matchmaker / friend-finding app** (aligned with the unit brief).
- Users primarily discover others through **profiles + matching**, with an additional **local posts feed**.
- The TCG theme supports matching through shared interests (favourite TCG(s), favourite cards, play style, etc.).

---

## 3. MVP Backend Feature Scope (In Scope)
### 3.1 Authentication
- Users can sign up and log in using **email/password** (Supabase Auth).
- Authentication identifiers and emails are treated as **private**.

### 3.2 User Profiles
- Users can create and update their own profile.
- Profiles are **public by default**.
- Users can set their profile to **private**:
  - When private, **non-friends cannot view the user’s posts**.
- Users can only edit their **own** profile.

**Typical public profile fields (examples):**
- display name / username
- bio
- favourite TCG or game
- favourite cards (limited list) OR interests/tags

**Private profile fields (examples):**
- auth identifiers
- email address
- report/moderation metadata

### 3.3 Interests / TCG Data
To avoid unmanageable data sizes, the MVP will not include full “massive collections”.
- Users will instead provide:
  - a shortlist of **favourite cards** and/or
  - selected **TCG interests** (from a list)
- This data supports matching and profile discovery.

### 3.4 Matching & Connections (Friend System)
- Users can discover other profiles and send a **connection/friend request**.
- Users can accept or reject requests.
- Once accepted, users become “friends/connected”.

**Key rules:**
- Users cannot send duplicate requests.
- Blocked users cannot send requests (see Safety section).
- Optional (MVP-friendly): prevent requests if already friends.

### 3.5 Posts (Local Feed)
- Users can create posts, view a feed, and interact with posts.
- Posts are **public to all users**, including users who are not logged in.
- Users can delete or archive their own posts.

### 3.6 Post Interactions
- Users can:
  - **like** posts
  - **comment** on posts
- Users may remove their own likes/comments.

### 3.7 Direct Messaging (DMs)
- Users can send direct messages **only to users they are connected/friends with**.
- Users cannot DM blocked users and cannot DM users who have blocked them.
- MVP messaging is basic (text only); no advanced features required.

### 3.8 Safety & Ethics (Mandatory)
Block and report are mandatory MVP features due to the ethical/legal responsibilities of connecting users.

#### Block
- Users can block another user.
- Blocking should:
  - remove/disable friendship if applicable (“unfriend” effect)
  - prevent sending future friend requests
  - prevent DMs between the two users
  - exclude each other from matching/discovery where feasible

#### Report
- Users can report another user (and/or content if implemented).
- Reports are:
  - stored only (no moderation workflow required for MVP)
  - visible only to admins
- Users cannot view reports they have made.

---

## 4. Non-Functional Requirements (Backend-Relevant)
- Access control is enforced via **RLS** with least-privilege policies.
- Data should be structured to support incremental feature additions.
- Basic validation should be applied (length limits, required fields).
- The system should be maintainable and understandable for handover.

---

## 5. Privacy & Visibility Rules (Summary)
- Profiles: public by default; can be private.
- Posts: public to everyone (including logged-out users).
- Favourite cards / interests: visible to everyone (MVP).
- Private profiles: posts hidden from non-friends.
- Blocking: prevents requests and DMs; removes friendship where applicable.

---

## 6. Permissions & Ownership Rules (Summary)
- Users may edit only their own profile.
- Users may create and delete/archive only their own posts.
- Users may create likes/comments and remove their own.
- Users cannot read report records (admin-only).
- Users can view blocks they have created.

---

## 7. Out of Scope / Future Enhancements
These may be considered if time allows but are not required for MVP:
- advanced matchmaking algorithms/recommendations
- notifications
- group chats
- moderation dashboard/workflow
- advertisements or society/club integration
- trading system (listings, offers, verification)

---

## 8. Change Control
If scope changes are agreed in meetings:
- Update this document first.
- Update Trello cards to match the new requirements.
- Record the change briefly in meeting minutes.
