import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ProblemSidebar } from "@/components/problem-sidebar"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProfilePage() {
  // Create a Supabase client for server component
  const supabase = createServerComponentClient({ cookies })

  // Get the user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile and submissions
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, problems(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalSubmissions = submissions?.length || 0
  const successfulSubmissions = submissions?.filter((s) => s.status === "success").length || 0
  const uniqueProblems = new Set(submissions?.map((s) => s.problem_id)).size

  return (
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
        <main className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubmissions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Successful Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{successfulSubmissions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalSubmissions > 0 ? `${Math.round((successfulSubmissions / totalSubmissions) * 100)}%` : "0%"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Problems Attempted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueProblems}</div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
          {submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.slice(0, 5).map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{submission.problems?.title}</CardTitle>
                      <Badge className={submission.status === "success" ? "bg-green-500" : "bg-red-500"}>
                        {submission.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Submitted on {new Date(submission.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">You haven't submitted any solutions yet.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
