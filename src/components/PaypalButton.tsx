'use client'

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Loader2 } from 'lucide-react'
import { PayPalNamespace } from "@paypal/paypal-js"

interface PayPalButtonProps {
  planId: string
  price: string
  userId: string
}

declare global {
  var paypal: PayPalNamespace | null | undefined;
}

export default function PayPalButton({ planId, price, userId }: PayPalButtonProps) {
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
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
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
            color: "black",
            label: "pay",
            shape: "pill",
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price,
                  },
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

              // Reload after a short delay
              setTimeout(() => {
                window.location.reload()
              }, 2000)
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
  }, [paypalScriptLoaded, price, userId, planId, toast])

  const isTestMode = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.includes('sb-');

  return (
    <div className="w-full">
      {isTestMode && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-4" role="alert">
          <p className="font-bold">Test Mode</p>
          <p>This is a sandbox PayPal integration. No real payments will be processed.</p>
        </div>
      )}
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

