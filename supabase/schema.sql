-- Create todos table
CREATE TABLE public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policies for todos table
-- Allow users to select only their own todos
CREATE POLICY "Users can view their own todos" 
  ON public.todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own todos (and ensure user_id is set to their auth ID)
CREATE POLICY "Users can create their own todos" 
  ON public.todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own todos
CREATE POLICY "Users can update their own todos" 
  ON public.todos
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete only their own todos
CREATE POLICY "Users can delete their own todos" 
  ON public.todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX todos_user_id_idx ON public.todos(user_id);
CREATE INDEX todos_created_at_idx ON public.todos(created_at);

-- Add trigger to set user_id automatically on insert if not specified
CREATE OR REPLACE FUNCTION public.set_todo_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_todo_user_id_trigger
BEFORE INSERT ON public.todos
FOR EACH ROW
WHEN (NEW.user_id IS NULL)
EXECUTE FUNCTION public.set_todo_user_id();
