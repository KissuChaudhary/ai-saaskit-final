import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  const { planId, userId } = await req.json()

  const supabase = createRouteHandlerClient({ cookies })

  // Fetch the plan details
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
  }

  try {
    const order = await razorpay.orders.create({
      amount: plan.amount * 100, // Razorpay expects amount in smallest currency unit
      currency: plan.currency,
      receipt: `order_${Date.now()}`,
      notes: {
        planId: planId,
        userId: userId,
      },
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Error creating Razorpay order' }, { status: 500 })
  }
}

