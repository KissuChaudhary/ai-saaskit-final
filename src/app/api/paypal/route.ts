import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface CustomerSubscription {
  id: string;
  // Add other fields as necessary
}

export async function POST(request: Request) {
  try {
    const { orderId, userId, planId } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    if (!orderId || !userId || !planId) {
      return NextResponse.json(
        { message: "Missing payment details" },
        { status: 400 }
      )
    }

    // Fetch the subscription plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      console.error("Error fetching plan:", planError)
      return NextResponse.json(
        { message: "Invalid subscription plan" },
        { status: 400 }
      )
    }

    // Create or update customer subscription
    const { data: subscription, error: subscriptionError }: PostgrestSingleResponse<CustomerSubscription> = await supabase
      .from('customer_subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        paypal_order_id: orderId,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error("Error updating subscription:", subscriptionError)
      return NextResponse.json(
        { message: "Failed to update subscription" },
        { status: 500 }
      )
    }

    // Update user credits
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single()

    if (creditsError && creditsError.code !== 'PGRST116') {
      console.error("Error fetching user credits:", creditsError)
      return NextResponse.json(
        { message: "Error fetching user credits" },
        { status: 500 }
      )
    }

    const newCredits = (userCredits?.credits || 0) + plan.credits

    const { error: updateError } = await supabase
      .from('user_credits')
      .upsert({ 
        user_id: userId, 
        credits: newCredits 
      }, { 
        onConflict: 'user_id' 
      })

    if (updateError) {
      console.error("Error updating user credits:", updateError)
      return NextResponse.json(
        { message: "Failed to update user credits" },
        { status: 500 }
      )
    }

    // Add to billing history
    const { error: billingError } = await supabase
      .from('billing_history')
      .insert({
        user_id: userId,
        amount: plan.amount,
        currency: plan.currency,
        status: 'succeeded',
        subscription_id: subscription?.id ?? null,
        order_id: orderId
      })

    if (billingError) {
      console.error("Error adding to billing history:", billingError)
    }

    return NextResponse.json({
      message: "Subscription and credits updated successfully",
      credits: newCredits,
    })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json(
      { message: "Error processing payment" },
      { status: 500 }
    )
  }
}

