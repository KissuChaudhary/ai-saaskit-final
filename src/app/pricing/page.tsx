import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import PricingTable from "@/components/PricingTable"

export const dynamic = "force-dynamic"

export default async function PricingPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error)
    return redirect("/login")
  }
  const user = data.user

  if (!user) {
    return redirect("/login")
  }

  return <PricingTable user={user} />
}

