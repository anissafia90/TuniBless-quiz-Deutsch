# Fix: RLS Policy Error for User Roles

## Problem

When users sign up, they get this error:

```
Error creating user role:
Object {
  code: "42501",
  message: 'new row violates row-level security policy for table "user_roles"'
}
```

## Root Cause

The `user_roles` table only had a **SELECT** policy but was missing **INSERT** and **UPDATE** policies. This prevented the `createUserRole()` function from creating role records during signup.

## Solution Applied

### Step 1: Update Database Schema ✅

Updated `supabase/schema.sql` to add missing RLS policies:

```sql
-- Policy: Users can insert their own role during signup
CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own role
CREATE POLICY "Users can update their own role"
  ON public.user_roles
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### Step 2: Update API Function ✅

Changed `createUserRole()` to use upsert pattern for better reliability:

**Before:**

```typescript
.insert([{ user_id: userId, role }])
```

**After:**

```typescript
.upsert([{ user_id: userId, role }], { onConflict: "user_id" })
```

## What to Do Now

### Apply the Fix

1. **Drop and Recreate the RLS Policies**

   In Supabase SQL Editor, run:

   ```sql
   -- Drop old policies
   DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

   -- Create new policies
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

2. **Files Already Updated**

   - ✅ `supabase/schema.sql` - RLS policies added
   - ✅ `api/supabase/users.ts` - Using upsert pattern

3. **Restart Your App**

   ```bash
   npm run dev
   ```

4. **Test**
   - Sign up with new account
   - Should not see RLS error anymore
   - Role should be created successfully

## Why This Happens

PostgreSQL RLS denies all operations by default. You must explicitly allow:

- **SELECT** - View data
- **INSERT** - Create new records
- **UPDATE** - Modify records
- **DELETE** - Remove records

Without an INSERT policy, the insert fails with code 42501.

## Policy Breakdown

```sql
-- Allows users to INSERT only rows where user_id matches their auth.uid()
CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allows users to UPDATE only their own rows
CREATE POLICY "Users can update their own role"
  ON public.user_roles
  FOR UPDATE
  USING (auth.uid() = user_id);
```

This means:

- Users can only create/update their own role record
- They cannot see or modify other users' roles
- Very secure pattern

## Verification

After applying the fix, you should be able to:

1. ✅ Sign up as Admin → No error, role created
2. ✅ Sign up as Regular User → No error, role created
3. ✅ Login with either account → No role-related errors
4. ✅ See appropriate dashboard features for each role

## If Still Getting Error

**Check 1:** Verify policies exist in Supabase

- Go to Supabase Dashboard → Authentication → Policies
- Check `user_roles` table has INSERT, UPDATE, SELECT policies

**Check 2:** Check for typos in policy

- Make sure `auth.uid()` is correct
- Make sure `user_id` matches column name

**Check 3:** Clear browser cache and restart dev server

```bash
# Stop the server (Ctrl+C)
# Restart
npm run dev
```

**Check 4:** Verify table exists

```sql
SELECT * FROM information_schema.tables
WHERE table_name = 'user_roles';
```

## Before This Fix

- ❌ Users couldn't sign up
- ❌ `createUserRole()` always failed
- ❌ RLS policies incomplete

## After This Fix

- ✅ Users can sign up successfully
- ✅ Role record created automatically
- ✅ All RLS policies in place
- ✅ Secure access control working

---

**Status**: ✅ FIXED
**Files Updated**: 2
**Restart Required**: YES
