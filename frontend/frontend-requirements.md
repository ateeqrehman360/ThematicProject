# Frontend Requirements (TCG Social / Local Matchmaking App)

## 1. Overview

This document defines the frontend requirements for a hyper-local social platform designed for Trading Card Game (TCG) collectors and players. The app helps users discover nearby collectors, share posts, manage small card collections, and interact safely within their local community.

**Frontend platform:** Vue 3 (Vite) + Tailwind CSS + Pinia + Vue Router

**Owner:** Frontend Lead – responsible for maintaining this document as scope evolves.

The frontend will consume Supabase services via a shared service layer and present a clean, mobile-first interface suitable for handover and future expansion.

---

## 2. Core Product Decisions

- The application is a **local TCG-focused social platform**, not a marketplace.
- Users discover others through:
  - public profiles
  - local feed posts
  - small curated card collections
  - local discovery (players, events, stores)
- The TCG theme provides shared interests that drive interaction and community building.
- The frontend must be **mobile-first, accessible, and safe** for users of all ages.

---

## 3. MVP Frontend Feature Scope (In Scope)

### 3.1 Authentication (Frontend)

- Login and signup pages using Supabase authentication.
- Client-side form validation.
- Auth state stored in Pinia.
- Redirect guards using Vue Router.
- Error and success UI states.

### 3.2 User Profiles

Users can view and edit their own profile.

**Public profile fields** (visible to all):
- display name / username
- bio
- TCGs played
- favourite cards or interest tags
- avatar

**Private data** (never shown):
- email
- authentication identifiers
- moderation/report metadata

**Rules:**
- Users may edit only their own profile.
- Private profiles hide posts from non-friends.

### 3.3 Interests / TCG Data

To keep the MVP manageable:
- Full card collections are **out of scope**.
- Users instead select:
  - a shortlist of favourite cards
  - predefined TCG interest tags

This data supports profile discovery and filtering.

**Frontend must support:**
- interest selection UI
- card/tag display components

### 3.4 Connections (Friend Requests)

Users can browse profiles and send connection requests.

- Requests can be accepted or rejected.
- Accepted requests create a friendship/connection.

**Rules:**
- Duplicate requests are prevented.
- Blocked users cannot send or receive requests.
- Existing friendships prevent new requests.

**Frontend must support:**
- Add Friend / Cancel Request / Accept / Reject buttons
- Connection status indicators
- Disabled actions for blocked users

### 3.5 Local Feed (Posts)

- Users can create posts (text + optional image).
- Users can browse a local feed.
- Posts are **public to everyone**, including logged-out users.
- Users may delete or archive their own posts.

**Frontend must support:**
- Feed page
- Post card component
- Create Post modal
- Delete/archive actions
- Loading + empty states

### 3.6 Post Interactions

Users can:
- like posts
- comment on posts
- remove their own likes and comments

**Frontend must support:**
- Like button with count
- Comment thread UI
- Comment composer
- Error + loading states

### 3.7 Direct Messaging (DMs)

Messaging is included with safety restrictions.

- Users may send direct messages to any other user, unless blocked.
- If users are **not friends**, messaging is limited to **5 messages per sender**.
- Once users become friends, messaging becomes **unlimited**.
- If either user blocks the other, messaging is **disabled in both directions**.

**Frontend must support:**
- Messaging page
- Conversation list
- Chat window
- Trade request button
- Message limit UI
- Disabled messaging for blocked users

### 3.8 Local Discovery

Users can browse:
- nearby players
- local events
- hobby stores

**Frontend must support:**
- Discovery page with tabs
- Filter by TCG
- Profile preview modal
- Loading + empty states

### 3.9 Safety & Ethics (Mandatory)

#### Block
Users can block other users.

**Blocking:**
- removes existing friendships
- prevents future friend requests
- disables direct messaging
- hides blocked users from discovery where possible

#### Report
Users can report another user or post.

**Reports:**
- are stored for review only
- are visible only to administrators
- Users cannot view reports they have submitted.

---

## 4. Privacy & Visibility Rules (Summary)

- **Profiles:** public by default; optional private mode.
- **Posts:** visible to everyone (including logged-out users).
- **Favourite cards / interests:** always visible.
- **Private profiles:** posts hidden from non-friends.
- **Blocking:** prevents requests and messaging.

---

## 5. Permissions & Ownership Rules

- Users may edit only their own profile.
- Users may create, delete, or archive only their own posts.
- Users may create and remove only their own likes and comments.
- Users may view blocks they have created.
- Users may **not** view report records (admin-only).

---

## 6. Non-Functional Requirements (Frontend-Relevant)

- Mobile-first performance.
- Lazy-loaded routes and component-level code splitting.
- Semantic HTML and ARIA labels.
- High-contrast Tailwind classes for accessibility.
- Modular Vue components and composables.
- Shared service layer for API calls.
- Clear folder structure and documented component patterns.

---

## 7. Out of Scope / Future Enhancements

Not required for MVP but may be added later:

- full trading system
- advanced matchmaking
- push notifications
- group chats
- moderation dashboards
- card scanning / OCR
- deck builders
- marketplace features

---

## 8. Change Control

If scope changes are agreed:

- This document is updated first.
- Frontend Trello cards are updated to match.
