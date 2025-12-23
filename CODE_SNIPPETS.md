# Code Snippets & Common Tasks

## Using the Role System in Components

### Check if User is Admin

```typescript
import { useAuth } from "@/lib/auth";

export default function MyComponent() {
  const { isAdmin, user, role } = useAuth();

  if (isAdmin()) {
    return <div>Admin content</div>;
  }

  return <div>Regular user content</div>;
}
```

### Protected Component with Redirect

```typescript
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminOnlyPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin()) {
      router.push("/quizzes");
    }
  }, [isLoading, isAdmin, router]);

  if (!isAdmin()) return null;

  return <div>Admin only content</div>;
}
```

### Show Different UI Based on Role

```typescript
import { useAuth } from "@/lib/auth";

export default function QuizActions({ quizId }: { quizId: string }) {
  const { isAdmin } = useAuth();

  return (
    <div className="space-x-2">
      <Button>View Quiz</Button>

      {isAdmin() && (
        <>
          <Button type="primary">Edit</Button>
          <Button danger>Delete</Button>
        </>
      )}
    </div>
  );
}
```

---

## Managing User Roles

### Promote User to Admin (in Supabase SQL)

```sql
UPDATE user_roles
SET role = 'admin', updated_at = NOW()
WHERE user_id = 'USER_ID_HERE';
```

### Demote Admin to Regular User

```sql
UPDATE user_roles
SET role = 'user', updated_at = NOW()
WHERE user_id = 'USER_ID_HERE';
```

### Get All Admins

```sql
SELECT user_id, role, created_at
FROM user_roles
WHERE role = 'admin';
```

### Count Users by Role

```sql
SELECT role, COUNT(*) as count
FROM user_roles
GROUP BY role;
```

### Bulk Update Roles

```sql
-- Make multiple users admins
UPDATE user_roles
SET role = 'admin'
WHERE user_id IN ('user1_id', 'user2_id', 'user3_id');
```

---

## Quiz Management

### Fetch Admin's Quizzes

```typescript
import { useAdminQuizzes } from "@/api/hooks/useAdminQuizzes";

export default function MyQuizzes() {
  const { data: quizzes, isLoading } = useAdminQuizzes(1, 10, "");

  return (
    <div>
      {quizzes?.data.map((quiz) => (
        <div key={quiz.id}>
          <h3>{quiz.title}</h3>
          <p>Status: {quiz.published ? "Published" : "Draft"}</p>
        </div>
      ))}
    </div>
  );
}
```

### Create Quiz Programmatically

```typescript
import { useCreateQuiz } from "@/api/hooks/useAdminQuizzes";

export default function CreateQuizButton() {
  const createMutation = useCreateQuiz();

  const handleCreate = async () => {
    try {
      const newQuiz = await createMutation.mutateAsync({
        title: "My Quiz",
        description: "Quiz Description",
        published: false,
        cover_image: null,
        author_id: "current_user_id",
      });

      console.log("Quiz created:", newQuiz.id);
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  return (
    <Button onClick={handleCreate} loading={createMutation.isPending}>
      Create Quiz
    </Button>
  );
}
```

### Publish/Unpublish Quiz

```typescript
import { useTogglePublishQuiz } from "@/api/hooks/useAdminQuizzes";

export default function PublishButton({ quizId, isPublished }: any) {
  const toggleMutation = useTogglePublishQuiz();

  const handleToggle = () => {
    toggleMutation.mutate(
      { id: quizId, publish: !isPublished },
      {
        onSuccess: () => {
          message.success(isPublished ? "Unpublished" : "Published");
        },
        onError: () => {
          message.error("Failed to update quiz");
        },
      }
    );
  };

  return (
    <Button onClick={handleToggle} loading={toggleMutation.isPending}>
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}
```

### Delete Quiz

```typescript
import { useDeleteQuiz } from "@/api/hooks/useAdminQuizzes";
import { Modal, message } from "antd";

export default function DeleteButton({ quizId }: any) {
  const deleteMutation = useDeleteQuiz();

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Quiz",
      content: "Are you sure? This cannot be undone.",
      okType: "danger",
      onOk() {
        deleteMutation.mutate(quizId, {
          onSuccess: () => {
            message.success("Quiz deleted");
          },
        });
      },
    });
  };

  return (
    <Button danger onClick={handleDelete} loading={deleteMutation.isPending}>
      Delete
    </Button>
  );
}
```

---

## Fetching Quizzes

### Get All Published Quizzes (for everyone)

```typescript
import { useQuizzes } from "@/api/hooks/useQuizzes";

export default function PublicQuizzes() {
  const { data: quizzes } = useQuizzes(1, 10, false, "");

  return (
    <div>
      {quizzes?.data.map((quiz) => (
        <div key={quiz.id}>{quiz.title}</div>
      ))}
    </div>
  );
}
```

### Search Quizzes

```typescript
export default function QuizSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: quizzes } = useQuizzes(1, 10, false, searchTerm);

  return (
    <div>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {quizzes?.data.map((quiz) => (
        <div key={quiz.id}>{quiz.title}</div>
      ))}
    </div>
  );
}
```

### Paginate Through Quizzes

```typescript
export default function PaginatedQuizzes() {
  const [page, setPage] = useState(1);
  const { data: quizzes } = useQuizzes(page, 10, false, "");

  return (
    <div>
      <div>
        {quizzes?.data.map((quiz) => (
          <div key={quiz.id}>{quiz.title}</div>
        ))}
      </div>
      <Pagination
        current={page}
        total={quizzes?.total || 0}
        pageSize={10}
        onChange={setPage}
      />
    </div>
  );
}
```

---

## Authentication

### Get Current User Info

```typescript
import { useAuth } from "@/lib/auth";

export default function UserInfo() {
  const { user, role, isAdmin } = useAuth();

  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Role: {role}</p>
      <p>Is Admin: {isAdmin() ? "Yes" : "No"}</p>
    </div>
  );
}
```

### Sign Out

```typescript
import { useAuth } from "@/lib/auth";

export default function LogoutButton() {
  const { signOut } = useAuth();

  return <Button onClick={signOut}>Sign Out</Button>;
}
```

### Handle Loading State

```typescript
import { useAuth } from "@/lib/auth";
import { Spin } from "antd";

export default function Page() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Spin />;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <div>Welcome {user.email}</div>;
}
```

---

## Advanced Patterns

### Create a Admin-Only Wrapper Component

```typescript
import { useAuth } from "@/lib/auth";
import { Empty } from "antd";

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminOnly({ children, fallback }: AdminOnlyProps) {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return fallback || <Empty description="Access Denied" />;
  }

  return <>{children}</>;
}

// Usage:
<AdminOnly>
  <Button>Create Quiz</Button>
</AdminOnly>;
```

### Create a Conditional Navigation Hook

```typescript
import { useAuth } from "@/lib/auth";

export function useNavigation() {
  const { isAdmin } = useAuth();

  const getNavItems = () => {
    const items = [{ label: "Quizzes", href: "/quizzes" }];

    if (isAdmin()) {
      items.push({ label: "Create Quiz", href: "/quizzes/new" });
      items.push({ label: "My Quizzes", href: "/quizzes?tab=my-quizzes" });
    }

    return items;
  };

  return { navItems: getNavItems() };
}
```

### Create a Role Guard Middleware

```typescript
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRoleGuard(requiredRole: "admin" | "user") {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== requiredRole) {
      router.push("/quizzes");
    }
  }, [role, isLoading, router, requiredRole]);

  return { isAuthorized: role === requiredRole, isLoading };
}

// Usage:
export default function AdminPage() {
  const { isAuthorized, isLoading } = useRoleGuard("admin");

  if (isLoading) return <Spin />;
  if (!isAuthorized) return null;

  return <div>Admin content</div>;
}
```

---

## Error Handling

### Handle Quiz Creation Errors

```typescript
const createMutation = useCreateQuiz();

const handleCreate = async (quizData: any) => {
  try {
    const quiz = await createMutation.mutateAsync(quizData);
    message.success("Quiz created!");
    return quiz;
  } catch (error: any) {
    if (error.message.includes("Only admins")) {
      message.error("Only admins can create quizzes");
    } else {
      message.error("Failed to create quiz");
    }
    return null;
  }
};
```

### Graceful Fallback for Permission Denied

```typescript
import { useAuth } from "@/lib/auth";

export default function SensitiveContent() {
  const { isAdmin } = useAuth();

  return (
    <div>
      {isAdmin() ? (
        <div>{/* Admin content */}</div>
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-800">
          <p>This feature is only available for admins.</p>
          <p>Contact an administrator if you need access.</p>
        </div>
      )}
    </div>
  );
}
```

---

## Testing

### Mock useAuth Hook

```typescript
// In your test file
jest.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: { id: "123", email: "test@example.com" },
    role: "admin",
    isAdmin: () => true,
    isLoading: false,
    signOut: jest.fn(),
  }),
}));
```

### Test Admin-Only Component

```typescript
import { render } from "@testing-library/react";
import AdminComponent from "./AdminComponent";

jest.mock("@/lib/auth", () => ({
  useAuth: () => ({
    isAdmin: () => true,
  }),
}));

test("renders admin content", () => {
  const { getByText } = render(<AdminComponent />);
  expect(getByText("Admin Button")).toBeInTheDocument();
});
```

---

## Performance Tips

### Memoize Role Check

```typescript
import { useMemo } from "react";
import { useAuth } from "@/lib/auth";

export default function Component() {
  const { role } = useAuth();

  const isAdmin = useMemo(() => role === "admin", [role]);

  return isAdmin ? <AdminUI /> : <UserUI />;
}
```

### Avoid Re-renders on Role Change

```typescript
import { useCallback } from "react";
import { useAuth } from "@/lib/auth";

export default function QuizActions() {
  const { isAdmin } = useAuth();

  const handleAdminAction = useCallback(() => {
    if (!isAdmin()) return;
    // admin action
  }, [isAdmin]);

  return <Button onClick={handleAdminAction}>Admin Action</Button>;
}
```

---

## Resources

- [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) - Full documentation
- [QUICK_START.md](QUICK_START.md) - Setup guide
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Overview
