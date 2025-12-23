# How to Make a User Admin

Since all new signups now create regular users automatically, here's how to promote a user to admin.

## Method 1: In Supabase SQL Editor

1. **Get the user ID** of the account you want to make admin:

   ```sql
   SELECT id, email FROM auth.users;
   ```

2. **Update the user role to admin**:

   ```sql
   UPDATE user_roles
   SET role = 'admin'
   WHERE user_id = 'PASTE_USER_ID_HERE';
   ```

   Example:

   ```sql
   UPDATE user_roles
   SET role = 'admin'
   WHERE user_id = '123e4567-e89b-12d3-a456-426614174000';
   ```

3. **Verify the change**:
   ```sql
   SELECT u.email, ur.role
   FROM auth.users u
   JOIN user_roles ur ON u.id = ur.user_id
   WHERE ur.role = 'admin';
   ```

## Method 2: Using User's Email

If you know the user's email:

```sql
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);
```

## Method 3: Create Admin Directly

If you haven't created your admin account yet:

1. Sign up normally through the app
2. Then run this SQL with your email:
   ```sql
   UPDATE user_roles
   SET role = 'admin'
   WHERE user_id = (
     SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
   );
   ```

## Verify Admin Access

After promoting to admin:

1. **Log out** from the app
2. **Log back in** with the admin account
3. You should now see:
   - ✅ "My Quizzes" tab
   - ✅ "Create Quiz" button
   - ✅ Edit/Delete buttons on your quizzes
   - ✅ Publish/Unpublish options

## Demote Admin to Regular User

If you need to remove admin privileges:

```sql
UPDATE user_roles
SET role = 'user'
WHERE user_id = 'USER_ID_HERE';
```

## Check All Admin Users

To see all admins in your system:

```sql
SELECT
  u.email,
  u.created_at as account_created,
  ur.role
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY u.created_at;
```

## Important Notes

- ⚠️ You must **log out and log back in** for role changes to take effect
- ⚠️ Clear browser cache if you don't see changes immediately
- ⚠️ Only make trusted users admins - they can create/delete quizzes
- ✅ New signups are automatically regular users
- ✅ You can have multiple admins if needed

## Quick Reference

**Make admin:**

```sql
UPDATE user_roles SET role = 'admin' WHERE user_id = 'USER_ID';
```

**Make regular user:**

```sql
UPDATE user_roles SET role = 'user' WHERE user_id = 'USER_ID';
```

**Find user ID by email:**

```sql
SELECT id FROM auth.users WHERE email = 'user@example.com';
```
