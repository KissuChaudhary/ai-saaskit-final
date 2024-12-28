-- Update the handle_new_user function to add 5 free credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);

    -- Insert into profiles table
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);

    -- Insert into user_credits table with 5 initial credits
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (NEW.id, 5);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is in place
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

