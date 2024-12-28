'use client'

import { User } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon } from 'lucide-react'
import PayPalButton from "./PaypalButton"

interface PricingTableProps {
  user: User
  plans: SubscriptionPlan[]
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price_id: string
  amount: number
  currency: string
  interval: string
  features: string[]
  credits: number
}

export default function PricingTable({ user, plans }: PricingTableProps) {
  return (
    <div className="px-4 mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`rounded-2xl bg-card ${
            plan.name === 'Pro' ? 'border-primary shadow-lg' : 'border-border'
          }`}
        >
          <CardHeader className="text-center p-6 sm:px-8 lg:p-12">
            <CardTitle className="text-lg font-medium">
              {plan.name}
            </CardTitle>
            <div className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold sm:text-4xl">
                ${(plan.amount / 100).toFixed(2)}
              </strong>
              <span className="text-sm font-medium text-muted-foreground">
                {" "}
                /{plan.interval}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:px-8 lg:p-12">
            <ul className="mt-6 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <PayPalButton
              planId={plan.id}
              price={(plan.amount / 100).toString()}
              userId={user.id}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

