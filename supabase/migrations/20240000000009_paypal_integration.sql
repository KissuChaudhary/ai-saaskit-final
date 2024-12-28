-- Function to create a PayPal order
CREATE OR REPLACE FUNCTION create_paypal_order(
    p_user_id UUID,
    p_plan_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
BEGIN
    -- Insert a new row into customer_subscriptions
    INSERT INTO public.customer_subscriptions (
        user_id,
        subscription_id,
        plan_id,
        status,
        current_period_start,
        current_period_end
    )
    VALUES (
        p_user_id,
        'PENDING', -- This will be updated when the payment is completed
        p_plan_id,
        'pending',
        NOW(),
        NOW() + INTERVAL '1 month' -- Assuming monthly subscriptions
    )
    RETURNING id INTO v_order_id;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve a PayPal order
CREATE OR REPLACE FUNCTION approve_paypal_order(
    p_order_id UUID,
    p_paypal_subscription_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_plan_amount NUMERIC;
    v_plan_currency TEXT;
BEGIN
    -- Update the customer_subscription
    UPDATE public.customer_subscriptions
    SET status = 'active',
        subscription_id = p_paypal_subscription_id,
        updated_at = NOW()
    WHERE id = p_order_id;

    -- Get the plan amount and currency
    SELECT amount, currency
    INTO v_plan_amount, v_plan_currency
    FROM public.subscription_plans sp
    JOIN public.customer_subscriptions cs ON sp.id = cs.plan_id
    WHERE cs.id = p_order_id;

    -- Insert into billing_history
    INSERT INTO public.billing_history (
        user_id,
        subscription_id,
        amount,
        currency,
        status
    )
    SELECT 
        user_id,
        p_order_id,
        v_plan_amount,
        v_plan_currency,
        'succeeded'
    FROM public.customer_subscriptions
    WHERE id = p_order_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel a PayPal subscription
CREATE OR REPLACE FUNCTION cancel_paypal_subscription(
    p_subscription_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.customer_subscriptions
    SET status = 'canceled',
        cancel_at_period_end = TRUE,
        canceled_at = NOW(),
        updated_at = NOW()
    WHERE id = p_subscription_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle PayPal webhooks
CREATE OR REPLACE FUNCTION handle_paypal_webhook(
    p_event_type TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT,
    p_event_data JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Insert the webhook data
    INSERT INTO public.paypal_webhooks (
        event_type,
        resource_type,
        resource_id,
        event_data
    ) VALUES (
        p_event_type,
        p_resource_type,
        p_resource_id,
        p_event_data
    );

    -- Handle different event types
    CASE p_event_type
        WHEN 'PAYMENT.SALE.COMPLETED' THEN
            -- Update subscription status if needed
            UPDATE public.customer_subscriptions
            SET status = 'active',
                updated_at = NOW()
            WHERE subscription_id = p_resource_id;

        WHEN 'BILLING.SUBSCRIPTION.CANCELLED' THEN
            -- Cancel the subscription
            UPDATE public.customer_subscriptions
            SET status = 'canceled',
                cancel_at_period_end = TRUE,
                canceled_at = NOW(),
                updated_at = NOW()
            WHERE subscription_id = p_resource_id;

        -- Add more event types as needed

    END CASE;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

