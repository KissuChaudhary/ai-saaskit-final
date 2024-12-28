'use client'

import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import PaymentButton from './PaymentButton'

interface SubscriptionPlan {
  id: string;
  name: string;
  amount: number;
  interval: string;
  features: string[];
}

type Props = {
  user: User
}

const PricingTable = ({ user }: Props) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch('/api/subscription-plans')
      const data = await response.json()
      setPlans(data)
    }
    fetchPlans()
  }, [])

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Your subscription has been updated.",
      duration: 2000,
    })
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="px-4 mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
      {plans.map((plan) => (
        <Card key={plan.id} className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <CardHeader className="text-center p-6 sm:px-8 lg:p-12">
            <CardTitle className="text-lg font-medium text-gray-900">
              {plan.name}
            </CardTitle>
            <div className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                ${plan.amount}
              </strong>
              <span className="text-sm font-medium text-gray-700">
                {" "}
                /{plan.interval}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:px-8 lg:p-12">
            <ul className="mt-6 space-y-2">
              {plan.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <PaymentButton
                planId={plan.id}
                amount={plan.amount}
                userId={user.id}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default PricingTable

