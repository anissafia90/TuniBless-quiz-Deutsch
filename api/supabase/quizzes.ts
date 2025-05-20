import { supabase } from "@/lib/supabase"
import type { Quiz } from "@/lib/types"

// Get all quizzes with pagination
export const getQuizzes = async (
  page = 1,
  pageSize = 9,
  isPublicRoute = false,
): Promise<{ data: Quiz[]; total: number }> => {
  // Calculate the range for pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    // First get the total count
    let countQuery = supabase.from("quizzes").select("*", { count: "exact", head: true })

    // If it's a public route, only show published quizzes
    if (isPublicRoute) {
      countQuery = countQuery.eq("published", true)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error("Error counting quizzes:", countError)
      throw countError
    }

    // Then get the paginated data
    let dataQuery = supabase.from("quizzes").select("*").order("created_at", { ascending: false }).range(from, to)

    // If it's a public route, only show published quizzes
    if (isPublicRoute) {
      dataQuery = dataQuery.eq("published", true)
    }

    const { data, error } = await dataQuery

    if (error) {
      console.error("Error fetching quizzes:", error)
      throw error
    }

    return {
      data: data || [],
      total: count || 0,
    }
  } catch (error) {
    console.error("Error in getQuizzes:", error)
    return { data: [], total: 0 }
  }
}

// Get a single quiz by ID
export const getQuizById = async (id: string): Promise<Quiz | null> => {
  try {
    const { data, error } = await supabase.from("quizzes").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching quiz with ID ${id}:`, error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in getQuizById:", error)
    return null
  }
}

// Create a new quiz
export const createQuiz = async (quiz: Omit<Quiz, "id" | "created_at" | "updated_at">): Promise<Quiz> => {
  const { data, error } = await supabase
    .from("quizzes")
    .insert([
      {
        ...quiz,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating quiz:", error)
    throw error
  }

  return data
}

// Update an existing quiz
export const updateQuiz = async (id: string, updates: Partial<Quiz>): Promise<Quiz> => {
  const { data, error } = await supabase
    .from("quizzes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating quiz with ID ${id}:`, error)
    throw error
  }

  return data
}

// Delete a quiz
export const deleteQuiz = async (id: string): Promise<void> => {
  const { error } = await supabase.from("quizzes").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting quiz with ID ${id}:`, error)
    throw error
  }
}

// Publish a quiz
export const publishQuiz = async (id: string): Promise<Quiz> => {
  return updateQuiz(id, { published: true })
}

// Unpublish a quiz
export const unpublishQuiz = async (id: string): Promise<Quiz> => {
  return updateQuiz(id, { published: false })
}
