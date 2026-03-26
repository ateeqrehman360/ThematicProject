# Backend Requirements (TCG Friend-Finding / Matchmaker App)

## 1. Overview
This document captures the backend requirements for a friend-finding / matchmaking application themed around Trading Card Games (TCG). The app aims to reduce social isolation by helping users discover and connect with others who share similar interests, while considering the ethical and legal responsibilities of putting people in contact with one another.

**Backend platform:** Supabase (Authentication, PostgreSQL, Row Level Security)  
**Owner:** Ateeq (Backend Lead) – responsible for maintaining this document as scope evolves.

---

## 2. Core Product Decisions
- The application is a **friend-finding / matchmaker app**, aligned with the unit brief.
- Users primarily discover others through **public profiles and interest-based matching**.
- A **local posts feed** supports discovery and community interaction.
- The TCG theme provides shared interests that drive matching and engagement.

---

## 3. MVP Backend Feature Scope (In Scope)

### 3.1 Authentication
- Users can sign up and log in using **email/password authentication**.
- Authentication identifiers and email addresses are treated as **private data**.

---

### 3.2 User Profiles
- Users can create and update their own profile.
- Profiles are **public by default**.
- Users can choose to set their profile to **private**:
  - When private, **non-friends cannot view the user’s posts**.
- Users can only edit **their own** profile.

**Public profile fields (examples):**
- display name / username  
- bio  
- favourite TCG or game  
- favourite cards or interest tags  

**Private profile data (examples):**
- authentication identifiers  
- email address  
- moderation/report metadata  

---

### 3.3 Interests / TCG Data
To keep the MVP realistic and manageable:
- Full card collections are **out of scope**.
- Users instead select:
  - a shortlist of **favourite cards**, and/or
  - predefined **TCG interest tags**.
- This data supports profile discovery and matching.

---

### 3.4 Matching & Connections
- Users can browse profiles and send **friend/connection requests**.
- Requests can be accepted or rejected.
- Accepted requests create a **friendship/connection**.

**Rules:**
- Duplicate requests are prevented.
- Blocked users cannot send or receive requests.
- Existing friendships prevent new requests between the same users.

---

### 3.5 Posts (Local Feed)
- Users can create posts and browse a feed.
- Posts are **public to all users**, including users who are not logged in.
- Users may delete or archive **their own** posts.

---

### 3.6 Post Interactions
- Users can:
  - like posts
  - comment on posts
- Users may remove their own likes and comments.

---

### 3.7 Direct Messaging (DMs)
Messaging is included in the MVP with restrictions to support safety.

- Users may send direct messages to **any other user**, unless blocked.
- If users are **not friends**, messaging is limited to **5 messages per sender**.
- Once users become friends/connected, messaging becomes **unlimited**.
- If either user blocks the other, messaging is fully disabled in both directions.

**Enforcement:**
- The message limit is enforced **server-side** (e.g. via RPC logic).
- Block and friendship status override messaging permissions.

---

### 3.8 Safety & Ethics (Mandatory)

#### Block
- Users can block other users.
- Blocking:
  - removes existing friendships (“unfriend” effect)
  - prevents future friend requests
  - disables direct messaging
  - excludes users from discovery where feasible

#### Report
- Users can report another user (and/or content if applicable).
- Reports:
  - are stored for review only (no moderation workflow in MVP)
  - are visible **only to administrators**
- Users cannot view reports they have submitted.

---

## 4. Privacy & Visibility Rules (Summary)
- Profiles: public by default; optional private mode.
- Posts: public to everyone (including logged-out users).
- Favourite cards / interests: visible to everyone.
- Private profiles: posts hidden from non-friends.
- Blocking: prevents requests and messaging.

---

## 5. Permissions & Ownership Rules
- Users may edit only their own profile.
- Users may create, delete, or archive only their own posts.
- Users may create and remove their own likes and comments.
- Users may view blocks they have created.
- Users may not view report records (admin-only).

---

## 6. Non-Functional Requirements (Backend-Relevant)
- Access control is enforced using **Row Level Security** with least-privilege policies.
- Data structures should support future feature expansion.
- Basic validation (length limits, required fields) should be applied.
- The backend should be maintainable and suitable for handover.

---

## 7. Out of Scope / Future Enhancements
The following features are not required for MVP but may be considered in future:
- advanced matchmaking algorithms
- notifications
- group chats
- moderation dashboards
- advertisements or society/club integration
- trading systems

---

## 8. Change Control
If scope changes are agreed:
- This document is updated first.
- Backend Trello cards are updated to match.
- Changes are briefly recorded in meeting minutes.
