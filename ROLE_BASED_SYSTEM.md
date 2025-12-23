# Role-Based Quiz Application - Implementation Guide

## Overview

Your quiz application has been updated with a **role-based access control system** that distinguishes between two user types:

- **Admins**: Can create, edit, delete, and publish quizzes
- **Regular Users**: Can only take and view published quizzes

---

## Key Changes Made

### 1. **Database Schema Updates** ([supabase/schema.sql](supabase/schema.sql))

- Created new `user_roles` table to store user roles
- Updated RLS (Row-Level Security) policies to enforce role-based restrictions
- Only admins can create, update, and delete quizzes
- Regular users can only view published quizzes

### 2. **Type Definitions** ([lib/types.ts](lib/types.ts))

- Added `UserRole` type: `'admin' | 'user'`
- Added `UserRoleRecord` interface for database records

### 3. **Authentication System** ([lib/auth.tsx](lib/auth.tsx))

- Enhanced `AuthProvider` to fetch and store user role
- Added `role` to `AuthContextType`
- Added `isAdmin()` helper method
- Automatically fetches role on login/signup

### 4. **User Role Management API** ([api/supabase/users.ts](api/supabase/users.ts))

New functions for managing user roles:

- `getUserRole()`: Fetch user's current role
- `createUserRole()`: Create role record (called after signup)
- `updateUserRole()`: Update user role (admin only)
- `getAllUsersWithRoles()`: Get all users (admin only)

### 5. **Quiz API Updates** ([api/supabase/quizzes.ts](api/supabase/quizzes.ts))

- `getQuizzes()`: Now fetches only **published quizzes** for public view
- `getUserQuizzes()`: New function to fetch a specific user's quizzes (admin only)

### 6. **Admin Quiz Hook** ([api/hooks/useAdminQuizzes.ts](api/hooks/useAdminQuizzes.ts))

New hooks specifically for admin functionality:

- `useAdminQuizzes()`: Fetch admin's own quizzes
- `useCreateQuiz()`: Create quiz (admin only, with validation)
- `useUpdateQuiz()`: Update quiz (admin only)
- `useDeleteQuiz()`: Delete quiz (admin only)
- `useTogglePublishQuiz()`: Publish/unpublish quiz (admin only)

### 7. **Public Quiz Hook** ([api/hooks/useQuizzes.ts](api/hooks/useQuizzes.ts))

- Simplified to fetch only published quizzes
- No role checking needed (all users can see published quizzes)

### 8. **Login/Signup Page** ([app/login/page.tsx](app/login/page.tsx))

Enhanced signup flow:

- Users select their role during registration
- Choice between "Regular User" or "Admin"
- Role is immediately stored in database

### 9. **Quiz Creation Page** ([app/quizzes/new/page.tsx](app/quizzes/new/page.tsx))

- **Protected route**: Only admins can access
- Regular users see "Access Denied" message
- Clear messaging about role requirements

### 10. **Quizzes Dashboard** ([app/quizzes/page.tsx](app/quizzes/page.tsx))

Now features dual-tab interface:

- **"Available Quizzes"** tab: Shows all published quizzes (for all users)
- **"My Quizzes"** tab: Shows admin's draft and published quizzes (admin only)
  - Edit, publish/unpublish, and delete options
  - Search and pagination

### 11. **Quiz Card Component** ([components/quiz/QuizCard.tsx](components/quiz/QuizCard.tsx))

Enhanced card with role-aware features:

- Admin view: Edit, Delete, Publish/Unpublish buttons
- Public view: Only "Take Quiz" button for published quizzes
- Different actions based on user role

---

## User Flow

### **Admin User Flow**

1. Sign up → Select "Admin" role
2. Redirected to quizzes page
3. See "My Quizzes" tab with create quiz button
4. Can create, edit, publish, and delete quizzes
5. Published quizzes appear in "Available Quizzes" for all users

### **Regular User Flow**

1. Sign up → Select "Regular User" role
2. Redirected to quizzes page
3. Only see "Available Quizzes" tab
4. Can only take and view published quizzes
5. Cannot create, edit, or delete quizzes

---

## Database Schema Summary

### `user_roles` Table

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- role: TEXT ('admin' | 'user')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### RLS Policies Enforced

- Users can only view published quizzes
- Only admins can create quizzes
- Only admins can modify their own quizzes
- Only admins can delete their quizzes
- Users can view their own role only

---

## Environment Setup

### Prerequisites

- Supabase project (with auth enabled)
- Node.js 18+
- React 18+

### Installation Steps

1. **Run database migration**:

   - Apply the schema from `supabase/schema.sql` to your Supabase database

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables** (if not already done):

   - Add Supabase URL and Anon Key to `.env.local`

4. **Start development server**:
   ```bash
   pnpm dev
   ```

---

## Testing the Implementation

### Test as Admin

1. Sign up with role "Admin"
2. Verify you see "My Quizzes" tab
3. Click "Create Quiz" button
4. Create a test quiz
5. See draft quiz in "My Quizzes"
6. Publish the quiz
7. See it appear in "Available Quizzes"

### Test as Regular User

1. Sign up with role "Regular User"
2. Verify you DON'T see "My Quizzes" tab
3. Try accessing `/quizzes/new` → Should see "Access Denied"
4. See only published quizzes in "Available Quizzes"
5. Click "Take Quiz" to view published quizzes

### Test Access Control

1. As admin, create a draft quiz
2. As regular user, verify you cannot see it
3. As admin, publish the quiz
4. As regular user, verify you can now see it

---

## API Endpoint Summary

### Protected Endpoints (Admin Only)

- `POST /api/quizzes` - Create quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/:id/publish` - Publish quiz

### Public Endpoints (All Users)

- `GET /api/quizzes` - Get published quizzes only
- `GET /api/quizzes/:id` - Get quiz details (if published or owned by user)

---

## Security Considerations

✅ **Implemented Security Features**:

1. **Database-level RLS**: Policies enforce role restrictions at the database level
2. **Frontend validation**: UI components respect user roles
3. **Role verification**: Auth context stores and validates roles
4. **Protected routes**: Sensitive routes check user role before rendering

---

## Future Enhancements

Consider implementing:

1. **Admin Dashboard**: Manage all quizzes and users
2. **Analytics**: Track quiz performance and user statistics
3. **Quiz Categories**: Organize quizzes by topic
4. **Leaderboards**: Track top scorers
5. **Quiz Sharing**: Allow admins to share specific quizzes
6. **Bulk Operations**: Admin bulk publish/unpublish
7. **User Management**: Admins can promote/demote users

---

## File Structure

```
quiz_app/
├── app/
│   ├── login/page.tsx              # [UPDATED] Role selection on signup
│   └── quizzes/
│       ├── page.tsx                 # [UPDATED] Dual-tab dashboard
│       └── new/page.tsx             # [UPDATED] Admin-only creation
├── api/
│   ├── hooks/
│   │   ├── useQuizzes.ts           # [UPDATED] Public quizzes only
│   │   └── useAdminQuizzes.ts      # [NEW] Admin-specific hooks
│   └── supabase/
│       ├── quizzes.ts               # [UPDATED] Added getUserQuizzes
│       └── users.ts                 # [NEW] User role management
├── components/
│   └── quiz/QuizCard.tsx            # [UPDATED] Role-aware UI
├── lib/
│   ├── auth.tsx                     # [UPDATED] Role management
│   └── types.ts                     # [UPDATED] Added UserRole types
└── supabase/
    └── schema.sql                   # [UPDATED] Added user_roles table & RLS
```

---

## Support & Troubleshooting

### Issue: "Only admins can create quizzes" error

- **Solution**: Verify your user role in the `user_roles` table is set to `'admin'`

### Issue: Regular user can see all quizzes

- **Solution**: Ensure RLS policies are enabled on Supabase and the schema is correctly applied

### Issue: Cannot delete quizzes

- **Solution**: Verify you're the quiz creator (author_id matches your user ID)

---

## Conclusion

Your application now has a complete role-based system that:

- ✅ Restricts quiz creation to admins
- ✅ Allows regular users to take published quizzes
- ✅ Enforces access control at database level
- ✅ Provides role selection during signup
- ✅ Shows role-appropriate UI for each user type

For questions or issues, refer to the specific file comments in the implementation.
