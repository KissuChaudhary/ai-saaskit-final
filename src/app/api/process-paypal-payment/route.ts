import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { orderId, payerId, planId, amount } = await req.json()

  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Fetch the plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Create a new subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('customer_subscriptions')
      .insert({
        user_id: payerId,
        subscription_id: orderId,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      })
      .select()
      .single()

    if (subscriptionError || !subscription) {
      console.error('Error creating subscription:', subscriptionError)
      return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 })
    }

    // Add billing history entry
    const { error: billingError } = await supabase.from('billing_history').insert({
      user_id: payerId,
      subscription_id: subscription.id,
      amount: amount,
      currency: plan.currency,
      status: 'paid',
    })

    if (billingError) {
      console.error('Error creating billing history:', billingError)
      return NextResponse.json({ error: 'Error creating billing history' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing PayPal payment:', error)
    return NextResponse.json({ error: 'Error processing payment' }, { status: 500 })
  }
}

