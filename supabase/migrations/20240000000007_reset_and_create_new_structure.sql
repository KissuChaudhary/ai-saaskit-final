-- Step 1: Drop existing tables
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.customer_subscriptions CASCADE;
DROP TABLE IF EXISTS public.billing_history CASCADE;
DROP TABLE IF EXISTS public.user_credits CASCADE;
DROP TABLE IF EXISTS public.paypal_webhooks CASCADE;

-- Step 2: Create new tables

-- Create users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    website TEXT,
    avatar_url TEXT,
    bio TEXT,
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create user_credits table
CREATE TABLE public.user_credits (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_id TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    interval TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customer_subscriptions table
CREATE TABLE public.customer_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    subscription_id TEXT NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create billing_history table
CREATE TABLE public.billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    subscription_id UUID REFERENCES public.customer_subscriptions(id),
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL,
    invoice_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create paypal_webhooks table
CREATE TABLE public.paypal_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 3: Create indexes
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX idx_customer_subscriptions_user_id ON public.customer_subscriptions(user_id);
CREATE INDEX idx_billing_history_user_id ON public.billing_history(user_id);

-- Step 4: Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paypal_webhooks ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
-- Users table policies
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Profiles table policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User credits table policies
CREATE POLICY "Users can view their own credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own credits" ON public.user_credits FOR UPDATE USING (auth.uid() = user_id);

-- Subscription plans table policies
CREATE POLICY "Allow public read access to active plans" ON public.subscription_plans FOR SELECT USING (active = true);

-- Customer subscriptions table policies
CREATE POLICY "Users can view their own subscriptions" ON public.customer_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON public.customer_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Billing history table policies
CREATE POLICY "Users can view their own billing history" ON public.billing_history FOR SELECT USING (auth.uid() = user_id);

-- PayPal webhooks table policies
CREATE POLICY "Service role can manage PayPal webhooks" ON public.paypal_webhooks USING (auth.jwt()->>'role' = 'service_role');

-- Step 6: Create functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);

    INSERT INTO public.profiles (id)
    VALUES (NEW.id);

    INSERT INTO public.user_credits (user_id, credits)
    VALUES (NEW.id, 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON public.user_credits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customer_subscriptions_updated_at
    BEFORE UPDATE ON public.customer_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Step 7: Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_id, amount, interval, features) VALUES
('Starter', 'Perfect for side projects and small startups', '934523cf-eef2-487f-90b8-44de641d7a28', 99.00, 'month', '["Up to 5 team members", "Basic analytics", "Community support", "5GB storage", "API access"]'),
('Pro', 'Best for growing businesses', 'd3fd81ff-8268-49f6-9c58-49c1691219d7', 249.00, 'month', '["Unlimited team members", "Advanced analytics", "Priority support", "50GB storage", "API access", "Custom integrations"]'),
('Enterprise', 'For large scale applications', 'f7c9a97f-fe7f-432b-b9fa-3260566f7a0c', 999.00, 'month', '["Unlimited everything", "White-label options", "24/7 phone support", "500GB storage", "API access", "Custom development"]')
ON CONFLICT (id) DO NOTHING;

