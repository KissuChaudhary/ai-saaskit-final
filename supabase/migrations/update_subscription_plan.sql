-- Update the price of a specific plan
UPDATE public.subscription_plans
SET 
    amount = 129.00,  -- New price
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE 
    name = 'Starter'  -- Name of the plan you want to update
    AND price_id = '934523cf-eef2-487f-90b8-44de641d7a28';  -- Unique identifier for the plan

-- Optionally, you can verify the update
SELECT * FROM public.subscription_plans WHERE name = 'Starter';

