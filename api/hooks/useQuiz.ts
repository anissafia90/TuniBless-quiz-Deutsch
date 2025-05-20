"use client"

import { useQuery } from "@tanstack/react-query"
import { getQuizById } from "@/api/supabase/quizzes"
import { useAuth } from "@/lib/auth"

// Hook to fetch a single quiz by ID
export const useQuiz = (id: string, isPublicRoute = false) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => getQuizById(id),
    enabled: !!id && (!!user || isPublicRoute), // Enable if user is authenticated or it's a public route
  })
}
