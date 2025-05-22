import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://clhltxsdkazloxgwltie.supabase.co"!;
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsaGx0eHNka2F6bG94Z3dsdGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzM3NDgsImV4cCI6MjA2MjcwOTc0OH0.AqTmiza2kHTXre4F3SwhuecbCXgI3o5FlFgITvm1S4U";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
