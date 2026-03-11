# Kinship Frontend - Task Delegation

## ✅ Completed So Far
- Fixed TypeScript syntax errors in `postService.ts` and `userService.ts` (removed invalid `private` keyword from object literals)
- Removed favicon reference from `index.html` to eliminate 404 errors
- Created `.env` file with Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
- Initialized project structure with Vue 3, TypeScript, Tailwind CSS, and Vite
- Set up routing, stores (Pinia), services, and composables
- Configured development environment

---

## 📋 Tasks to Complete

### 🎨 **UMAR**
- [ ] **Apply Yellow Color Theme to Components**
  - Update Tailwind config to define primary yellow colors (main, light, dark variants)
  - Refactor component styling in `/src/components` to use yellow accent colors
  - Update buttons, cards, and interactive elements with yellow theme
  - Ensure hover/active states use yellow variations
  - Test color contrast for accessibility (WCAG compliance)

- [ ] **Update Global Styles**
  - Modify `/src/index.css` to reflect yellow color scheme
  - Create yellow gradient overlays where applicable
  - Update primary CTA buttons to yellow with proper contrast

---

### 🔗 **MICHAEL**
- [ ] **Connect Routes to Backend Services**
  - When backend is released, implement API calls in `useFeed.ts` composable
  - Connect feed post creation, deletion, and commenting to backend endpoints
  - Implement real-time like/unlike functionality via backend service
  - Add error handling and loading states for all route connections
  - Test with mock data before final integration

- [ ] **Backend Integration for Discovery Feature**
  - Connect `useDiscovery.ts` to backend API for player/card/store discovery
  - Implement filtering and search functionality
  - Handle pagination for discovery feeds

---

### 🎯 **DAWUD**
- [ ] **Implement Yellow Design in Profile & Settings**
  - Apply yellow theme to profile header, cards, and edit profile interface
  - Update navigation, sidebars, and menu items with yellow accents
  - Ensure profile badges and status indicators use yellow theme
  - Design profile picture frames/borders with yellow styling

- [ ] **Connect Routes to Backend - Messaging & Friends**
  - When backend is released, implement messaging API integration in `useMessages.ts`
  - Connect friend request, accept, and block functionalities
  - Implement real-time message updates (if backend supports WebSockets)
  - Add notification indicators with yellow badges

---

## 🚀 Next Steps
1. Backend team to provide API endpoint documentation
2. Coordinate color palette constants to ensure consistency
3. Set up mock API responses for parallel development
4. Schedule integration testing once backend is ready

## 📁 Key Files to Modify
- `src/components/` - All Vue components
- `src/index.css` - Global styles
- `tailwind.config.ts` - Theme colors
- `src/composables/` - Service integration
- `src/services/` - Backend API calls
