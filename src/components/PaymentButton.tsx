'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PayPalButton from './PayPalButton'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

interface PaymentButtonProps {
  planId: string
  amount: number
  userId: string
  onSuccess?: () => void
}

export default function PaymentButton({ planId, amount, userId, onSuccess }: PaymentButtonProps) {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'razorpay'>('paypal')

  const handleRazorpayPayment = async () => {
    const response = await axios.post('/api/create-razorpay-order', { planId, userId })
    const { orderId } = response.data

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'USD',
      name: 'Your Company Name',
      description: 'Subscription Purchase',
      order_id: orderId,
      handler: async (response: any) => {
        try {
          await axios.post('/api/verify-razorpay-payment', {
            orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            planId,
            userId,
          })
          if (onSuccess) onSuccess()
        } catch (error) {
          console.error('Payment verification failed', error)
        }
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
      },
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
  }

  return (
    <div className="space-y-4">
      <Select onValueChange={(value: 'paypal' | 'razorpay') => setPaymentMethod(value)}>
        <SelectTrigger className="w-full bg-black/40 border-white/10 text-white">
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent side="top" className="bg-black/90 border-white/10">
          <SelectItem value="paypal" className="text-white hover:bg-white/10">PayPal</SelectItem>
          <SelectItem value="razorpay" className="text-white hover:bg-white/10">Razorpay</SelectItem>
        </SelectContent>
      </Select>

      {paymentMethod === 'paypal' && (
        <PayPalButton planId={planId} amount={amount} userId={userId} onSuccess={onSuccess} />
      )}

      {paymentMethod === 'razorpay' && (
        <Button 
          onClick={handleRazorpayPayment} 
          className="w-full bg-[#FFBE1A] text-black hover:bg-[#FFBE1A]/80"
        >
          Pay with Razorpay
        </Button>
      )}
    </div>
  )
}

