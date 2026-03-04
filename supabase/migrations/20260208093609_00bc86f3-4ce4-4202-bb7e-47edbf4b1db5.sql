-- Create complaints table
CREATE TABLE public.complaints (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id TEXT NOT NULL UNIQUE,
    resident_name TEXT NOT NULL,
    flat_number TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('water', 'electricity', 'housekeeping', 'security')),
    description TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create policy for public INSERT (anyone can submit a complaint)
CREATE POLICY "Anyone can submit complaints"
ON public.complaints
FOR INSERT
WITH CHECK (true);

-- Create policy for public SELECT (anyone can view complaints by complaint_id)
CREATE POLICY "Anyone can view their own complaints"
ON public.complaints
FOR SELECT
USING (true);

-- Create function to generate unique complaint ID
CREATE OR REPLACE FUNCTION public.generate_complaint_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.complaint_id := 'CMP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate complaint_id
CREATE TRIGGER set_complaint_id
    BEFORE INSERT ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_complaint_id();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for complaint images
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-images', 'complaint-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to complaint-images bucket
CREATE POLICY "Anyone can upload complaint images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'complaint-images');

-- Allow public viewing of complaint images
CREATE POLICY "Anyone can view complaint images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'complaint-images');