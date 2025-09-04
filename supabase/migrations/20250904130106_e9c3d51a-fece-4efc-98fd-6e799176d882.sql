-- Create the missing get_public_profile_by_id RPC function
CREATE OR REPLACE FUNCTION public.get_public_profile_by_id(profile_id uuid)
RETURNS TABLE(
    id uuid,
    name text,
    title text,
    company text,
    bio text,
    contact_info text,
    skills text[],
    image_url text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    is_own_profile boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.title,
        p.company,
        p.bio,
        -- Only show contact_info to the profile owner
        CASE 
            WHEN auth.uid() = p.user_id THEN p.contact_info
            ELSE NULL
        END as contact_info,
        p.skills,
        p.image_url,
        p.created_at,
        p.updated_at,
        -- Return whether this is the authenticated user's own profile
        (auth.uid() = p.user_id) as is_own_profile
    FROM public.profiles p
    WHERE p.id = profile_id;
END;
$$;