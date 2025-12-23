import { supabase } from "@/lib/supabase";
import type { UserRole, UserRoleRecord } from "@/lib/types";

// Get user role
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }

    return data?.role || null;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
};

// Create user role (called after signup) - uses upsert pattern
export const createUserRole = async (
  userId: string,
  role: UserRole = "user"
): Promise<UserRoleRecord | null> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .upsert([{ user_id: userId, role }], { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      console.error("Error creating user role:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createUserRole:", error);
    return null;
  }
};

// Update user role (admin only)
export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<UserRoleRecord | null> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .update({ role })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user role:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return null;
  }
};

// Get all users with roles (admin only)
export const getAllUsersWithRoles = async (): Promise<UserRoleRecord[]> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllUsersWithRoles:", error);
    return [];
  }
};
