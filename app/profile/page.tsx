import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProblemSidebar } from "@/components/problem-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <ProblemSidebar />
        <main className="flex-1">
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your personal account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p>{user.user_metadata?.full_name || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Account ID</h3>
                      <p className="text-xs font-mono">{user.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Summary</CardTitle>
                  <CardDescription>Your learning journey so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Problems Solved</h3>
                        <p className="text-3xl font-bold">0</p>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
                        <p className="text-3xl font-bold">0 days</p>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
                        <p className="text-3xl font-bold">0%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
