import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ProblemDetail } from "@/components/problem-detail"
import { ProblemSidebar } from "@/components/problem-sidebar"
import { UserNav } from "@/components/user-nav"
import { staticProblems } from "@/lib/static-data"

export default async function ProblemPage({ params }: { params: { id: string } }) {
  const problemId = Number.parseInt(params.id)

  // Create a Supabase client for server component
  const supabase = createServerComponentClient({ cookies })

  let problem

  try {
    // Try to fetch the problem from Supabase
    const { data, error } = await supabase.from("problems").select("*").eq("id", problemId).single()

    if (error) {
      console.error("Error fetching problem:", error)
      // Fall back to static data
      problem = staticProblems.find((p) => p.id === problemId)
    } else {
      problem = data
    }
  } catch (error) {
    console.error("Failed to fetch problem:", error)
    // Fall back to static data
    problem = staticProblems.find((p) => p.id === problemId)
  }

  if (!problem) {
    notFound()
  }

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
        <main>
          <ProblemDetail problem={problem} />
        </main>
      </div>
    </div>
  )
}
