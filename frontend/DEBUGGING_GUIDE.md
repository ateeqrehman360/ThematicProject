# Profile Loading Debugging Guide

## Summary
The app has comprehensive logging throughout the profile loading flow. When testing, open browser DevTools (F12) and check the Console tab to see the detailed logs.

## Expected Log Flow

### 1. App Initialization
```
App mounted - initializing auth...
Current user ID from auth: <user-id-here>
Auth store initialized, session: true
Loading user profile for: <user-id-here>
```

### 2. Profile Service Call
```
profileService.getProfile called with userId: <user-id-here>
[Supabase query executes]
profileService.getProfile response - data: {profile object} error: null
profileService.getProfile returning profile: {profile object}
```

### 3. User Store Processing
```
userStore.fetchUser called with: <user-id-here>
profileService response - data: {profile object} error: null
userStore.profile loaded successfully: {profile object}
```

### 4. Expected Result
App should log: `User profile loaded successfully in App.vue: {profile object}`

## What to Check When Testing

### Step 1: Deploy/Run the App
1. Run `npm run dev` in the terminal
2. Wait for the app to start and open in browser
3. Open DevTools (F12) and go to Console tab

### Step 2: Test Fresh Login
1. Go to https://localhost:5173/signup
2. Create new account with:
   - Email: test@example.com
   - Username: testuser
   - Password: Test@1234
   - DOB: 2000-01-01 (for age validation)
   - City: London
   - Area: Central
3. Watch console logs as page loads

### Step 3: Check Console Logs
Look for these log sequences:

**✅ GOOD SEQUENCE:**
```
App mounted - initializing auth...
Current user ID from auth: <id>
profileService.getProfile called with userId: <id>
profileService.getProfile response - data: {...username, ...} error: null
userStore.profile loaded successfully: {...username, ...}
```

**❌ BAD SEQUENCE 1 (Profile not found in DB):**
```
profileService.getProfile response - data: null error: null
userStore.fetchUser error: No profile found for user <id>
```
**Action:** Check if profile record was created in Supabase

**❌ BAD SEQUENCE 2 (RLS Policy blocking access):**
```
profileService.getProfile response - data: null error: {error details}
```
**Action:** Check Supabase RLS policy on profiles table

**❌ BAD SEQUENCE 3 (Auth not established):**
```
Current user ID from auth: null
No user ID found, skipping profile load
```
**Action:** Verify auth session is established before profile load

## Supabase Verification Checklist

### Profiles Table
- [ ] Table exists with columns: id, username, bio, city, area, date_of_birth, is_private, tcg_interests, created_at
- [ ] Has at least one test profile record
- [ ] RLS policies allow SELECT for authenticated users

### Auth Setup
- [ ] Email/password authentication enabled
- [ ] User can sign in and get valid session

## Quick Test Commands

### 1. Check if profile was created (in Supabase SQL editor):
```sql
SELECT * FROM profiles WHERE username = 'testuser';
```

### 2. Check RLS policy on profiles:
Go to Supabase Dashboard → profiles table → RLS Policies

### 3. Test direct query (in Supabase SQL editor):
```sql
SELECT * FROM profiles WHERE id = '<your-user-id>';
```

## Common Issues & Fixes

### Issue: "No profile found for user"
- **Cause:** Profile record not created during signup
- **Fix:** Create profile manually in Supabase or verify signup completes
- **Check:** Look for profile creation error in console during signup

### Issue: "Unauthorized" or RLS error
- **Cause:** RLS policy blocking read access
- **Fix:** Allow authenticated users to select their own profiles
- **Policy:** `auth.uid() = id`

### Issue: "No authenticated user found" in useCurrentUser
- **Cause:** Session not established or Page load timing issue
- **Fix:** Wait for auth to be ready before loading profile
- **Check:** Verify supabase.auth.getUser() returns a user

## Profile Usage After Load

Once profile is loaded:
- `userStore.profile` will have full User object
- All buttons (like, add friend) can check `!!userStore.profile` 
- Status updates will be available for friend buttons
- Like buttons will show visual feedback

## Testing Checklist

- [ ] Create account and see profile load logs
- [ ] Login with existing account and see profile load logs
- [ ] Click like button and verify profile available
- [ ] Click add friend button and verify profile available
- [ ] Check friend status is displayed correctly
