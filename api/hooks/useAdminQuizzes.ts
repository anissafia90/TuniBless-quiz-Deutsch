"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
} from "@/api/supabase/quizzes";
import type { Quiz } from "@/lib/types";
import { useAuth } from "@/lib/auth";

// Hook to fetch admin's own quizzes
export const useAdminQuizzes = (page = 1, pageSize = 9, searchTerm: string) => {
  const { user, role } = useAuth();

  return useQuery({
    queryKey: ["admin-quizzes", page, pageSize, searchTerm, user?.id],
    queryFn: () => getUserQuizzes(user?.id || "", page, pageSize, searchTerm),
    enabled: !!user && role === "admin", // Only fetch if user is admin
  });
};

// Hook to create a new quiz (admin only)
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  const { user, role } = useAuth();

  return useMutation({
    mutationFn: (quiz: Omit<Quiz, "created_at" | "updated_at">) => {
      // Only allow admins to create quizzes
      if (role !== "admin") {
        throw new Error("Only admins can create quizzes");
      }
      return createQuiz({
        ...quiz,
        author_id: user?.id || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
    },
  });
};

// Hook to update a quiz (admin only)
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Quiz> }) =>
      updateQuiz(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz", data.id] });
    },
  });
};

// Hook to delete a quiz (admin only)
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
    },
  });
};

// Hook to toggle publish status (admin only)
export const useTogglePublishQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      publish ? publishQuiz(id) : unpublishQuiz(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz", data.id] });
    },
  });
};
