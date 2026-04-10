Kinship – Social TCG Community Platform

Kinship is a full-stack social platform designed for Trading Card Game (TCG) communities. It enables players to discover others, build connections, share posts, and communicate — all within a secure, modern web application.

This project was developed as part of the 6G5Z0023 Thematic Project module.

⸻

🚀 Overview

Kinship provides a community space where players can:
	•	Create a profile and showcase their interests
	•	Discover other players based on location and TCG interests
	•	Send and accept friend requests
	•	Share posts and engage through likes and comments
	•	Chat via direct messages
	•	Control privacy through blocking and profile visibility

The project focuses on real-world social features, secure data handling, and scalable architecture.

⸻

🧱 Tech Stack

Frontend
	•	Vue 3 + TypeScript
	•	Tailwind CSS
	•	Pinia for state management

Backend
	•	Supabase (Backend-as-a-Service)
	•	PostgreSQL Database
	•	Supabase Auth
	•	Row-Level Security (RLS)

⸻

✨ Key Features

🔐 Authentication & Profiles
	•	User authentication via Supabase Auth
	•	UUID-based user system
	•	Profile creation & editing
	•	Privacy controls (public/private profiles)
	•	User discovery by location and TCG interests

👥 Social Connections
	•	Send, accept, and reject friend requests
	•	Persistent friendships
	•	Block users (automatically removes friendships and requests)

📝 Posts & Engagement
	•	Create posts
	•	Like posts
	•	Comment on posts
	•	Feed with like & comment counts

💬 Messaging
	•	Direct messaging between users
	•	Conversation view
	•	Block rules enforced on messaging

🛡️ Safety & Moderation
	•	Block users
	•	Report users
	•	Access control enforced through RLS

⸻

🗄️ Database & Architecture

The backend uses a relational schema with strong constraints and policies.

Core Tables
	•	profiles
	•	friend_requests
	•	friendships
	•	blocks
	•	posts
	•	post_comments
	•	post_likes
	•	direct_messages
	•	reports

Core Backend Logic

Implemented using PostgreSQL functions and RLS:
	•	Accept / reject friend requests
	•	Send friend requests with validation
	•	Send messages with block checks
	•	Block users with automatic cleanup

⸻

🔒 Security

Row-Level Security (RLS) is enabled across all tables.

Security rules enforce:
	•	Users can only modify their own data
	•	No self-friend or self-message actions
	•	No duplicate friend requests
	•	Blocked users cannot interact or appear in discovery

⸻

🎯 Project Status

The backend is MVP complete, with:
	•	Core social features implemented
	•	Relational data integrity enforced
	•	Authentication & security policies configured

The project is currently in the testing and UI integration phase.

⸻

🧠 What This Project Demonstrates
	•	Real-world relational data modelling
	•	Backend logic implemented in SQL (functions + constraints)
	•	Authentication and authorization using Supabase
	•	Clean separation between frontend and backend responsibilities
	•	Practical implementation of social platform features

⸻

📈 Future Improvements
	•	Real-time messaging
	•	Notification system
	•	Advanced discovery & filtering
	•	Image uploads and media support
	•	Enhanced moderation tooling

⸻

👨‍💻 Contributors

Developed as part of a team project at Manchester Metropolitan University.
