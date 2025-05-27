import type React from "react"
import AuthGuard from "@/components/auth-guard"
import SellerSidebar from "@/components/seller-sidebar"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard userType="seller">
      <div className="flex">
        <SellerSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </AuthGuard>
  )
}
