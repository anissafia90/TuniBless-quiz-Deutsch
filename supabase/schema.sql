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

-- Policy: Users can view all published quizzes
CREATE POLICY "Users can view all published quizzes" 
  ON public.quizzes 
  FOR SELECT 
  USING (published = true OR auth.uid() = author_id);

-- Policy: Users can insert their own quizzes
CREATE POLICY "Users can insert their own quizzes" 
  ON public.quizzes 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own quizzes
CREATE POLICY "Users can update their own quizzes" 
  ON public.quizzes 
  FOR UPDATE 
  USING (auth.uid() = author_id);

-- Policy: Users can delete their own quizzes
CREATE POLICY "Users can delete their own quizzes" 
  ON public.quizzes 
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Create RLS policies for questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

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

-- Policy: Users can insert questions for their own quizzes
CREATE POLICY "Users can insert questions for their own quizzes" 
  ON public.questions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

-- Policy: Users can update questions for their own quizzes
CREATE POLICY "Users can update questions for their own quizzes" 
  ON public.questions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

-- Policy: Users can delete questions for their own quizzes
CREATE POLICY "Users can delete questions for their own quizzes" 
  ON public.questions 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

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
