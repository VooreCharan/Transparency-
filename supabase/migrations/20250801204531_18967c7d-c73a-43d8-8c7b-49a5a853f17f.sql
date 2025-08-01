-- Update the check constraint to allow 'textarea' as a valid question type
ALTER TABLE public.questions 
DROP CONSTRAINT IF EXISTS questions_question_type_check;

-- Add the updated constraint with textarea included
ALTER TABLE public.questions 
ADD CONSTRAINT questions_question_type_check 
CHECK (question_type IN ('text', 'textarea', 'select'));