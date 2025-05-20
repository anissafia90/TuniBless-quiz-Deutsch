"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getQuizQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "@/api/supabase/questions"
import type { Question } from "@/lib/types"
import { useAuth } from "@/lib/auth"

// Hook to fetch all questions for a quiz
export const useQuizQuestions = (quizId: string, isPublicRoute = false) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["questions", quizId],
    queryFn: () => getQuizQuestions(quizId),
    enabled: !!quizId && (!!user || isPublicRoute), // Enable if user is authenticated or it's a public route
  })
}

// Hook to create a new question
export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (question: Omit<Question, "id" | "created_at" | "updated_at">) => createQuestion(question),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questions", data.quiz_id] })
      queryClient.invalidateQueries({ queryKey: ["quiz", data.quiz_id] })
    },
  })
}

// Hook to update a question
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Question> }) => updateQuestion(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questions", data.quiz_id] })
      queryClient.invalidateQueries({ queryKey: ["quiz", data.quiz_id] })
    },
  })
}

// Hook to delete a question
export const useDeleteQuestion = (quizId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", quizId] })
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] })
    },
  })
}

// Hook to reorder questions
export const useReorderQuestions = (quizId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionIds: string[]) => reorderQuestions(quizId, questionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", quizId] })
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] })
    },
  })
}
