import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://dctepktazhymcwzaarkm.supabase.co"!;
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdGVwa3Rhemh5bWN3emFhcmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNjYwNjQsImV4cCI6MjA4MTg0MjA2NH0.YA6kcraubWDfgy_KjcLy-zNTUcSAMfTZrHU72bmUruY";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
