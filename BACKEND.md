Backend Documentation
-----------

This document covers the backend architecture, security setup, database schema,and guidance for anyone continuing development on this project.

Tech Stack
----------

The backend uses Supabase as Baas (backend-as-a-service). This gives us a hosted PostgreSQL database, built in authentication, and Row level security (RLS) without needing a custom server or API.
The frontend (Vue) talks to Supabase directly using the JavaScript client from supabase/lib/supabaseClient.js.

Where Config Lives
-----------
Supabase credentials are stored as environment variables. You will need a .env file in the project root with the following:


SUPABASE_URL=your_project_url_here

SUPABASE_ANON_KEY=your_anon_key_here

-You can find both of these values in the Supabase project dashboard under Project Settings -> API.

-Theres no need to commit your .env file to GitHub. This is already listed in .gitignore.

How to run locally
-----------
1. Clone the repository
2. Install dependencies:

   npm install

Create a .env file in the project root and add your SUPABASE_URL
and SUPABASE_ANON_KEY (just as before)

Run the development server:

   npm run dev
   
The app will connect to the hosted Supabase project automatically. There is no local database to set up.

