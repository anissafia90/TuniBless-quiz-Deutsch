# Quick Fix - Apply These Changes

## The Problem

Users get error when signing up: `new row violates row-level security policy for table "user_roles"`

## The Solution (30 seconds)

### In Supabase SQL Editor, run this:

```sql
-- Drop old policy if it exists
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON public.user_roles;

-- Create correct policies
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own role"
  ON public.user_roles
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### Then:

1. Restart your app: `npm run dev`
2. Try signing up again - should work now!

## Done! ✅

The files are already updated:

- ✅ supabase/schema.sql
- ✅ api/supabase/users.ts

Just apply the SQL above and you're good to go.
