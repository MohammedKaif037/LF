import type React from "react"
import { ProblemSidebar } from "@/components/problem-sidebar"
import { UserNav } from "@/components/user-nav"
import { AuthGuard } from "@/components/auth-guard"

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <ProblemSidebar />
        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
