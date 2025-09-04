-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  bio TEXT,
  contact_info TEXT,
  skills TEXT[], -- Using array of strings for simplicity
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public directory)
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.profiles (name, title, company, bio, contact_info, skills, image_url) VALUES
('John Smith', 'Senior Software Engineer', 'TechCorp Inc', 'Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.', 'john.smith@techcorp.com', ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('Sarah Johnson', 'Product Manager', 'InnovateLabs', 'Strategic product leader with 8+ years experience driving product vision and execution. Expert in user research, roadmap planning, and cross-functional team leadership.', 'sarah.j@innovatelabs.com', ARRAY['Product Management', 'User Research', 'Agile', 'Data Analysis', 'Strategy'], 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
('Michael Chen', 'Data Scientist', 'DataFlow Analytics', 'PhD in Machine Learning with focus on NLP and computer vision. Published researcher with experience in deploying ML models at scale for Fortune 500 companies.', 'mchen@dataflow.ai', ARRAY['Machine Learning', 'Python', 'TensorFlow', 'SQL', 'Statistics'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('Emily Rodriguez', 'UX Designer', 'DesignStudio Co', 'Creative UX/UI designer specializing in mobile and web applications. Strong background in user-centered design, prototyping, and design systems.', 'emily.r@designstudio.co', ARRAY['UX Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems'], 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face');