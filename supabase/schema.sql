-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('two_choices', 'four_choices', 'input')),
  options JSONB DEFAULT '{}'::jsonb,
  correct_answer TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Helper function to reliably detect admin, bypassing RLS on user_roles
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = uid AND ur.role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;

-- Drop existing policies if they exist to avoid duplicates
DROP POLICY IF EXISTS "Users can view all published quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Only admins can insert quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Only admins can update quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Only admins can delete quizzes" ON public.quizzes;

-- Policy: Users can view all published quizzes OR their own
CREATE POLICY "Users can view all published quizzes"
  ON public.quizzes
  FOR SELECT
  USING (published = true OR auth.uid() = author_id);

-- Policy: Only admins can insert quizzes
CREATE POLICY "Only admins can insert quizzes"
  ON public.quizzes
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Policy: Only admins can update quizzes
CREATE POLICY "Only admins can update quizzes"
  ON public.quizzes
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Policy: Only admins can delete quizzes
CREATE POLICY "Only admins can delete quizzes"
  ON public.quizzes
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Drop existing question policies first
DROP POLICY IF EXISTS "Users can view questions for quizzes they can view" ON public.questions;
DROP POLICY IF EXISTS "Only admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Only admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Only admins can delete questions" ON public.questions;

-- Policy: Users can view questions for quizzes they can view
CREATE POLICY "Users can view questions for quizzes they can view"
  ON public.questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
        AND (quizzes.published = true OR quizzes.author_id = auth.uid())
    )
  );

-- Policy: Only admins can insert questions
CREATE POLICY "Only admins can insert questions"
  ON public.questions
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Policy: Only admins can update questions
CREATE POLICY "Only admins can update questions"
  ON public.questions
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Policy: Only admins can delete questions
CREATE POLICY "Only admins can delete questions"
  ON public.questions
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own role
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own role during signup
CREATE POLICY "Users can insert their own role" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own role
CREATE POLICY "Users can update their own role" 
  ON public.user_roles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create storage bucket for quiz assets
INSERT INTO storage.buckets (id, name, public) VALUES ('quiz-assets', 'quiz-assets', true);

-- Set up storage policies with simpler path structure
CREATE POLICY "Public Access" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'quiz-assets');

-- Simplified policy that doesn't try to parse the path as UUID
CREATE POLICY "User Upload Access" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'quiz-assets' 
    AND auth.uid()::text = SPLIT_PART(name, '/', 1)
  );

CREATE POLICY "User Update Access" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'quiz-assets' 
    AND auth.uid()::text = SPLIT_PART(name, '/', 1)
  );

CREATE POLICY "User Delete Access" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'quiz-assets' 
    AND auth.uid()::text = SPLIT_PART(name, '/', 1)
  );
