# IWish Implementation Plan

## Project Overview

**IWish** is a social "wish board" where users post what they have and what they want. The core interaction is Reddit-style upvoting on wishes, with a discovery loop to search "who still wants X after already having Y." Anonymous browsing is first-class; auth is required only to post or upvote.

**Stack:** Next.js 14 App Router · Supabase (Postgres + Auth + Realtime) · Tailwind CSS · Vercel

---

## Data Model

Three core tables:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE wish_status AS ENUM ('have', 'want');

CREATE TABLE wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  status wish_status NOT NULL,
  upvote_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE upvotes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  wish_id UUID REFERENCES wishes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, wish_id)
);
```

**RLS Policies:**
- `wishes`: public SELECT, auth-only INSERT (user_id = auth.uid()), owner-only UPDATE/DELETE
- `upvotes`: public SELECT, auth-only INSERT (user_id = auth.uid()), owner-only DELETE
- `profiles`: public SELECT, owner-only UPDATE

Increment `upvote_count` via Postgres trigger on `upvotes` INSERT/DELETE.

---

## Project Structure

```
app/
├── page.tsx                    # Landing page (home)
├── feed/page.tsx               # Public wishes feed
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/route.ts
├── wishes/
│   ├── [id]/page.tsx
│   └── new/page.tsx
└── profile/[username]/page.tsx

components/
├── WishCard.tsx                # Upvote button + wish display
├── WishFeed.tsx                # Feed wrapper
├── WishForm.tsx                # New wish form
└── AuthModal.tsx               # Login prompt

lib/
├── supabase/
│   ├── client.ts               # Browser client
│   └── server.ts               # Server client
└── types.ts

middleware.ts                   # Session refresh + route protection
supabase/migrations/            # SQL migrations
```

---

## Implementation Roadmap

### Phase 1: Core Auth (Backend)
1. Set up Supabase project and database schema
2. Write `lib/supabase/client.ts` and `lib/supabase/server.ts`
3. Create `middleware.ts` for session refresh and route protection
4. Implement `/auth/login`, `/auth/signup`, `/auth/callback`

### Phase 2: Core Feed (Frontend)
5. Build `app/page.tsx` (landing) — convert current placeholder to real feed
6. Build `WishCard.tsx` — display wish, status badge, upvote count
7. Build `WishFeed.tsx` — fetch wishes server-side, render cards
8. Implement upvote button with `AuthModal` soft gate

### Phase 3: Posting & User Features
9. Build `/wishes/new` form (`WishForm.tsx`)
10. Build `/profile/[username]` page
11. Implement search (`/search?q=...`)

### Phase 4: Polish & Deploy
12. Add real-time subscriptions (optional, phase 2+)
13. Error handling, loading states
14. Deploy to Vercel

---

## Auth Gate Strategy

- **Browse/search:** fully public, no auth
- **Upvote/Post:** click triggers `AuthModal` if unauthed
- Auth checks in Supabase RLS; UI gates at component level

---

## Current Status

✅ **Completed:**
- Next.js 14 bootstrap with TypeScript + Tailwind
- Landing page with hero + 3 feature cards
- Auth pages (signup/login) — placeholder forms
- Public feed page — sample wishes with "Have" / "Want" badges
- All navigation wired up and tested

⏳ **Next:**
- Supabase project setup + database schema
- Connect auth forms to Supabase
- Real feed data from database
- Upvote functionality
