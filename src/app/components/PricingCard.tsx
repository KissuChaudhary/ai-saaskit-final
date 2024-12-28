'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PayPalButtons } from "@paypal/react-paypal-js"
import { CheckIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
  priceId: string
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  buttonText,
  popular = false,
  priceId,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const createOrder = async (): Promise<string> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
      throw error // Re-throw the error instead of returning null
    } finally {
      setIsLoading(false)
    }
  }

  const onApprove = async (data: { orderID: string }): Promise<void> => {
    if (!data.orderID) {
      console.error('No order ID received');
      toast({
        title: "Error",
        description: "Failed to process order. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/approve-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
          priceId: priceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve order')
      }

      await response.json()

      toast({
        title: "Success",
        description: "Your subscription has been activated!",
      })
      router.refresh()
    } catch (error) {
      console.error('Error approving order:', error)
      toast({
        title: "Error",
        description: "Failed to activate subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`overflow-hidden ${popular ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader className={popular ? 'bg-primary text-primary-foreground' : ''}>
        <CardTitle>{title}</CardTitle>
        <CardDescription className={popular ? 'text-primary-foreground/90' : ''}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground ml-2">/month</span>
        </div>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="bg-muted/50 p-6">
        {isLoading ? (
          <Skeleton className="w-full h-10" />
        ) : (
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            style={{ layout: "horizontal", tagline: false }}
            disabled={isLoading}
            forceReRender={[priceId]}
          />
        )}
      </CardFooter>
    </Card>
  )
}

export default PricingCard

