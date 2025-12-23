import { supabase } from "@/lib/supabase";
import type { Quiz } from "@/lib/types";

// Get all quizzes with pagination
export const getQuizzes = async (
  page = 1,
  pageSize = 9,
  searchTerm: string
): Promise<{ data: Quiz[]; total: number }> => {
  // Calculate the range for pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    // First get the total count - only count published quizzes for public view
    // Use head:true with a minimal selection to avoid unnecessary clauses
    const { count, error: countError } = await supabase
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .eq("published", true);

    if (countError) {
      console.error("Error counting quizzes:", countError);
      throw countError;
    }

    console.log("📊 Published quizzes count:", count);

    // Then get the paginated data - only published quizzes
    let dataQuery = supabase
      .from("quizzes")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchTerm) {
      dataQuery = dataQuery.ilike("title", `%${searchTerm}%`);
    }

    const { data, error } = await dataQuery;

    if (error) {
      console.error("Error fetching quizzes:", error);
      throw new Error(error.message || "Failed to fetch quizzes");
    }

    console.log("✅ Fetched quizzes:", data?.length, "quizzes");
    console.log(
      "Quiz titles:",
      data?.map((q) => `"${q.title}" (published: ${q.published})`)
    );

    return {
      data: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("Error in getQuizzes:", error);
    return { data: [], total: 0 };
  }
};

// Get user's own quizzes (admin only)
export const getUserQuizzes = async (
  userId: string,
  page = 1,
  pageSize = 9,
  searchTerm: string
): Promise<{ data: Quiz[]; total: number }> => {
  // Calculate the range for pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    // First get the total count
    const { count, error: countError } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId)
      .order("created_at", { ascending: false });

    if (countError) {
      console.error("Error counting user quizzes:", countError);
      throw countError;
    }

    // Then get the paginated data
    let dataQuery = supabase
      .from("quizzes")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchTerm) {
      dataQuery = dataQuery.ilike("title", `%${searchTerm}%`);
    }

    const { data, error } = await dataQuery;

    if (error) {
      console.error("Error fetching user quizzes:", error);
      throw error;
    }

    return {
      data: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("Error in getUserQuizzes:", error);
    return { data: [], total: 0 };
  }
};

// Get a single quiz by ID
export const getQuizById = async (id: string): Promise<Quiz | null> => {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching quiz with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getQuizById:", error);
    return null;
  }
};

// Create a new quiz
export const createQuiz = async (
  quiz: Omit<Quiz, "created_at" | "updated_at">
): Promise<Quiz> => {
  const createdAt = new Date().toISOString();
  const payload = {
    ...quiz,
    created_at: createdAt,
    updated_at: createdAt,
  };

  const insertStart = performance.now();
  const { error } = await supabase
    .from("quizzes")
    .insert([payload], { returning: "minimal" });

  if (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }

  console.log(
    "Quiz insert completed in",
    `${(performance.now() - insertStart).toFixed(0)}ms`
  );

  // Return the payload (we already know the id because we set it client-side)
  return payload;
};

// Update an existing quiz
export const updateQuiz = async (
  id: string,
  updates: Partial<Quiz>
): Promise<Quiz> => {
  const { data, error } = await supabase
    .from("quizzes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating quiz with ID ${id}:`, error);
    throw error;
  }

  return data;
};

// Delete a quiz
export const deleteQuiz = async (id: string): Promise<void> => {
  const { error } = await supabase.from("quizzes").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting quiz with ID ${id}:`, error);
    throw error;
  }
};

// Publish a quiz
export const publishQuiz = async (id: string): Promise<Quiz> => {
  return updateQuiz(id, { published: true });
};

// Unpublish a quiz
export const unpublishQuiz = async (id: string): Promise<Quiz> => {
  return updateQuiz(id, { published: false });
};
