Backend Documentation
This document covers the backend architecture, database schema,and guidance for anyone continuing development on this project.

Tech Stack
The backend uses Supabase as Baas (backend-as-a-service). This gives us a hosted PostgreSQL database, built in authentication, and Row level security (RLS) without needing a custom server or API.
The frontend (Vue) talks to Supabase directly using the JavaScript client from supabase/lib/supabaseClient.js.
