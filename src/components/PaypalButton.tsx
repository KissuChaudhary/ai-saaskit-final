'use client'

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Loader2 } from 'lucide-react'
import { PayPalNamespace } from "@paypal/paypal-js"

interface PayPalButtonProps {
  planId: string
  amount: number
  userId: string
  onSuccess?: () => void
}

declare global {
  var paypal: PayPalNamespace | null | undefined;
}

export default function PayPalButton({ planId, amount, userId, onSuccess }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (window.paypal) {
      setPaypalScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`
    script.async = true
    script.onload = () => setPaypalScriptLoaded(true)
    script.onerror = () => {
      console.error("Failed to load PayPal script")
      setError("Failed to load PayPal script")
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (paypalScriptLoaded && paypalRef.current && window.paypal) {
      const paypal = window.paypal;
      if (paypal.Buttons && paypal.FUNDING) {
        paypal.Buttons({
          fundingSource: paypal.FUNDING.PAYPAL,
          style: {
            color: "gold",
            shape: "rect",
            label: "paypal",
            layout: "vertical",
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
              },
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: "USD"
                  },
                  description: `Subscription Plan: ${planId}`,
                },
              ],
            })
          },
          onApprove: async (data: any, actions: any) => {
            setLoading(true)
            try {
              const details = await actions.order.capture()
              
              await axios.post("/api/paypal", {
                orderId: details.id,
                userId: userId,
                planId: planId,
              })

              toast({
                title: "Payment Successful",
                description: "Your subscription has been activated.",
                duration: 2000,
              })

              if (onSuccess) {
                onSuccess()
              }
            } catch (error) {
              console.error("Error during payment process:", error)
              setError("Payment failed. Please try again.")
              toast({
                title: "Payment Failed",
                description: "There was an error processing your payment. Please try again.",
                variant: "destructive",
              })
            } finally {
              setLoading(false)
            }
          },
          onError: (err: any) => {
            console.error("PayPal Checkout error:", err)
            setError("Payment failed. Please try again.")
            toast({
              title: "Payment Error",
              description: "There was an error with PayPal. Please try again.",
              variant: "destructive",
            })
            setLoading(false)
          },
        }).render(paypalRef.current)
      } else {
        console.error("PayPal SDK is not fully loaded")
        setError("Failed to initialize PayPal")
      }
    }
  }, [paypalScriptLoaded, amount, userId, planId, toast, onSuccess])

  return (
    <div className="w-full">
      <div ref={paypalRef} className="mt-4"></div>
      {loading && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm text-muted-foreground">Processing payment...</p>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive mt-2 text-center">{error}</p>
      )}
    </div>
  )
}

