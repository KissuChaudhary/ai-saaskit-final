import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PricingTable from '@/components/PricingTable'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error)
    return redirect("/login")
  }
  const user = data.user

  if (!user) {
    return redirect('/login')
  }

  const { data: plans, error: plansError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('active', true)
    .order('amount', { ascending: true })

  if (plansError) {
    console.error('Error fetching plans:', plansError)
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
      <PricingTable user={user} />
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          All prices are in {plans[0]?.currency?.toUpperCase() || 'USD'} and include all applicable taxes.
          Subscriptions automatically renew unless cancelled.
        </p>
        <p className="mt-2">
          PayPal is our default payment method for your convenience. You can also choose to pay with Stripe or Razorpay.
        </p>
      </div>
    </div>
  )
}

