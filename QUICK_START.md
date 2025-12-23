# Quick Start Guide - Role-Based Quiz System

## What Changed?

Your quiz app now has **two user types**:

1. **Admin** - Creates and manages quizzes
2. **Regular User** - Takes quizzes

## Setup Instructions

### Step 1: Update Your Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Copy the entire content from supabase/schema.sql and run it in Supabase
```

**Or use the file directly:**

- Open `supabase/schema.sql`
- Copy all the SQL code
- Paste into Supabase SQL Editor
- Execute

### Step 2: Start Your App

```bash
pnpm dev
```

### Step 3: Test It

#### Create Admin Account

1. Go to `http://localhost:3000/login`
2. Click "Don't have an account? Sign Up"
3. Enter email and password
4. **Select "Admin"** option
5. Click "Sign Up"

#### Create Regular User Account

1. Repeat steps 1-3
2. **Select "Regular User"** option
3. Click "Sign Up"

## What Works Now?

### For Admins:

- ✅ Create new quizzes
- ✅ Edit existing quizzes
- ✅ Delete quizzes
- ✅ Publish/Unpublish quizzes
- ✅ See "My Quizzes" tab with draft and published quizzes

### For Regular Users:

- ✅ View all published quizzes
- ✅ Take published quizzes
- ✅ Search quizzes
- ❌ Cannot create quizzes (blocked)
- ❌ Cannot edit quizzes (blocked)
- ❌ Cannot delete quizzes (blocked)

## Key Files Changed

| File                           | Change                                      |
| ------------------------------ | ------------------------------------------- |
| `supabase/schema.sql`          | Added `user_roles` table + RLS policies     |
| `lib/types.ts`                 | Added `UserRole` and `UserRoleRecord` types |
| `lib/auth.tsx`                 | Added role fetching and `isAdmin()` method  |
| `api/supabase/users.ts`        | NEW - Role management functions             |
| `api/hooks/useAdminQuizzes.ts` | NEW - Admin-specific hooks                  |
| `api/hooks/useQuizzes.ts`      | Updated - Public quizzes only               |
| `app/login/page.tsx`           | Updated - Role selection on signup          |
| `app/quizzes/page.tsx`         | Updated - Dual-tab dashboard                |
| `app/quizzes/new/page.tsx`     | Updated - Admin-only protection             |
| `components/quiz/QuizCard.tsx` | Updated - Role-aware actions                |

## Common Tasks

### How to make an existing user an admin?

In Supabase, go to SQL Editor and run:

```sql
UPDATE user_roles
SET role = 'admin'
WHERE user_id = 'USER_ID_HERE';
```

### How to check if user is admin in code?

```typescript
import { useAuth } from "@/lib/auth";

export default function MyComponent() {
  const { isAdmin } = useAuth();

  if (isAdmin()) {
    return <div>Admin content</div>;
  }
  return <div>Regular user content</div>;
}
```

### How to make quiz creation admin-only?

It's already done! Check `app/quizzes/new/page.tsx` - it redirects non-admins.

## Database Schema

**user_roles table:**

```
id (UUID) → Primary Key
user_id (UUID) → Links to auth.users
role (TEXT) → 'admin' or 'user'
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Troubleshooting

**Q: User signed up but can't create quizzes?**  
A: Check `user_roles` table - ensure their role is set to `'admin'`

**Q: Regular user can see draft quizzes?**  
A: RLS policies might not be enabled. Go to Supabase → Security → RLS and enable for `quizzes` and `questions` tables.

**Q: Getting authentication errors?**  
A: Make sure `.env.local` has your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Next Steps

1. ✅ Run the database migrations
2. ✅ Test with admin account
3. ✅ Test with regular user account
4. ✅ Verify access controls work
5. 📖 Read `ROLE_BASED_SYSTEM.md` for detailed info

Enjoy your role-based quiz platform! 🚀
