import { supabase } from "@/lib/supabase";
import type { Question } from "@/lib/types";

// Get all questions for a quiz
export const getQuizQuestions = async (quizId: string): Promise<Question[]> => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("order", { ascending: true });

  if (error) {
    console.error(`Error fetching questions for quiz ${quizId}:`, error);
    throw error;
  }

  return data || [];
};

// Create a new question
export const createQuestion = async (
  question: Omit<Question, "id" | "created_at" | "updated_at">
): Promise<Question> => {
  const { data, error } = await supabase
    .from("questions")
    .insert([
      {
        ...question,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating question:", error);
    throw error;
  }

  return data;
};

// Update an existing question
export const updateQuestion = async (
  id: string,
  updates: Partial<Question>
): Promise<Question> => {
  const { data, error } = await supabase
    .from("questions")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating question with ID ${id}:`, error);
    throw error;
  }

  return data;
};

// Delete a question
export const deleteQuestion = async (id: string): Promise<void> => {
  const { error } = await supabase.from("questions").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting question with ID ${id}:`, error);
    throw error;
  }
};

// Reorder questions
export const reorderQuestions = async (
  quizId: string,
  questionIds: string[]
): Promise<void> => {
  try {
    for (let index = 0; index < questionIds.length; index++) {
      const id = questionIds[index];
      const { error } = await supabase
        .from("questions")
        .update({ order: index + 1 })
        .eq("id", id)
        .eq("quiz_id", quizId);

      if (error) {
        console.error(`Failed to update order for question ${id}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error in reorderQuestions for quiz ${quizId}:`, error);
    throw error;
  }
};
