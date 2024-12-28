// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// })

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  // Commented out Stripe webhook handling
  /*
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === 'subscription') {
        const subscriptionId = session.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        
        // Update customer_subscriptions table
        await supabase.from('customer_subscriptions').insert({
          user_id: session.client_reference_id,
          subscription_id: subscriptionId,
          plan_id: session.metadata?.planId,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
        })

        // Update billing_history table
        await supabase.from('billing_history').insert({
          user_id: session.client_reference_id,
          subscription_id: subscriptionId,
          amount: session.amount_total! / 100,
          currency: session.currency,
          status: 'paid',
        })
      }
      break

    case 'invoice.paid':
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription) {
        // Update billing_history table
        await supabase.from('billing_history').insert({
          user_id: invoice.customer as string,
          subscription_id: invoice.subscription as string,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: 'paid',
        })
      }
      break

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const updatedSubscription = event.data.object as Stripe.Subscription
      
      // Update customer_subscriptions table
      await supabase.from('customer_subscriptions')
        .update({
          status: updatedSubscription.status,
          current_period_start: new Date(updatedSubscription.current_period_start * 1000),
          current_period_end: new Date(updatedSubscription.current_period_end * 1000),
          cancel_at_period_end: updatedSubscription.cancel_at_period_end,
          canceled_at: updatedSubscription.canceled_at ? new Date(updatedSubscription.canceled_at * 1000) : null,
        })
        .eq('subscription_id', updatedSubscription.id)
      break
  }
  */

  return NextResponse.json({ received: true, message: "Stripe webhooks are currently disabled" })
}

