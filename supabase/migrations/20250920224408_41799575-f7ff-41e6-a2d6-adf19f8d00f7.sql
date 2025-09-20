-- Create a function to make the first user with admin email an admin
CREATE OR REPLACE FUNCTION public.make_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Find user by email
    SELECT user_id INTO admin_user_id
    FROM public.profiles
    WHERE email = admin_email;
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', admin_email;
    END IF;
    
    -- Add admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN true;
END;
$function$;

-- Create a function to automatically make specific emails admin on signup
CREATE OR REPLACE FUNCTION public.auto_admin_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Auto-admin for specific emails (add your admin emails here)
    IF NEW.email IN ('admin@travelogie.io', 'pr@travelogie.io') THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger to auto-assign admin role
DROP TRIGGER IF EXISTS auto_admin_trigger ON public.profiles;
CREATE TRIGGER auto_admin_trigger
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_admin_check();