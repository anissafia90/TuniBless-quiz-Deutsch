"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
} from "@/api/supabase/quizzes";
import type { Quiz } from "@/lib/types";
import { useAuth } from "@/lib/auth";

// Hook to fetch all quizzes with pagination
export const useQuizzes = (
  page = 1,
  pageSize = 9,
  isPublicRoute = false,
  searchTerm: string
) => {
  const { user } = useAuth();
  console.log(searchTerm);

  return useQuery({
    queryKey: ["quizzes", page, pageSize, searchTerm],
    queryFn: () => getQuizzes(page, pageSize, searchTerm),
    enabled: !!user || isPublicRoute, // Only fetch if user is authenticated or it's a public route
  });
};

// Hook to create a new quiz
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (quiz: Omit<Quiz, "id" | "created_at" | "updated_at">) =>
      createQuiz({
        ...quiz,
        author_id: user?.id || "anonymous", // Add the current user's ID
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

// Hook to update a quiz
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Quiz> }) =>
      updateQuiz(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz", data.id] });
    },
  });
};

// Hook to delete a quiz
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

// Hook to toggle publish status (publish or unpublish)
export const useTogglePublishQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      publish ? publishQuiz(id) : unpublishQuiz(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz", data.id] });
    },
  });
};
