"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "@/api/supabase/quizzes";
import type { Quiz } from "@/lib/types";

// Hook to fetch all published quizzes (for regular users)
export const useQuizzes = (
  page = 1,
  pageSize = 9,
  isPublicRoute = false,
  searchTerm: string
) => {
  return useQuery({
    queryKey: ["quizzes", page, pageSize, searchTerm],
    queryFn: () => getQuizzes(page, pageSize, searchTerm),
    enabled: true, // Always enabled since quizzes are public
  });
};
