import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { orderId, paymentId, signature, planId, userId } = await req.json()

  const supabase = createRouteHandlerClient({ cookies })

  // Verify the payment signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  if (generatedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

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
        user_id: userId,
        subscription_id: paymentId,
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
      user_id: userId,
      subscription_id: subscription.id,
      amount: plan.amount,
      currency: plan.currency,
      status: 'paid',
    })

    if (billingError) {
      console.error('Error creating billing history:', billingError)
      return NextResponse.json({ error: 'Error creating billing history' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing Razorpay payment:', error)
    return NextResponse.json({ error: 'Error processing payment' }, { status: 500 })
  }
}

