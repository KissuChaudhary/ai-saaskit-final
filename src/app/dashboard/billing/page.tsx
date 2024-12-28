import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon } from 'lucide-react'
import PayPalButton from '@/components/PaypalButton'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price_id: string
  amount: number
  currency: string
  interval: string
  features: string[]
}

export default async function BillingPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('active', true)
    .order('amount', { ascending: true })

  console.log('Fetched plans:', plans);

  if (error) {
    console.error('Error fetching plans:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-destructive">Error Loading Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We encountered an error while loading the subscription plans. 
              Please try again later or contact support if the issue persists.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">No Plans Available</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              There are currently no subscription plans available. 
              Please check back later or contact support for assistance.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose the perfect plan for your needs. All plans include access to our core features.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan: SubscriptionPlan) => (
          <Card key={plan.id} className={`overflow-hidden ${plan.name === 'Pro' ? 'border-primary shadow-lg' : ''}`}>
            <CardHeader className={plan.name === 'Pro' ? 'bg-primary text-primary-foreground' : ''}>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className={plan.name === 'Pro' ? 'text-primary-foreground/90' : ''}>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <span className="text-4xl font-bold">${(plan.amount / 100).toFixed(2)}</span>
                <span className="text-muted-foreground ml-2">/{plan.interval}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <PayPalButton
                planId={plan.id}
                price={(plan.amount / 100).toString()}
                userId={session.user.id}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          All prices are in {plans[0]?.currency?.toUpperCase() || 'USD'} and include all applicable taxes.
          Subscriptions automatically renew unless cancelled.
        </p>
      </div>
    </div>
  )
}

