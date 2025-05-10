"use client"
//List of Problems 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { type Problem, getProblems } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
}

export function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProblems()
        setProblems(data)
      } catch (err) {
        console.error("Failed to load problems:", err)
        setError("Failed to load problems. Using fallback data.")
      } finally {
        setLoading(false)
      }
    }

    loadProblems()
  }, [])

  const filteredProblems =
    filter === "All"
      ? problems
      : filter === "Completed"
        ? problems.filter((p) => p.completed)
        : problems.filter((p) => !p.completed)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "All" ? "default" : "outline"} size="sm" onClick={() => setFilter("All")}>
          All Problems
        </Button>
        <Button
          variant={filter === "Completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Completed")}
        >
          Completed
        </Button>
        <Button
          variant={filter === "Incomplete" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Incomplete")}
        >
          Incomplete
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <div className="flex flex-wrap gap-1 mt-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-secondary/30 pt-3 pb-3">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <Card key={problem.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {problem.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                    Problem {problem.id}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={difficultyColors[problem.difficulty as keyof typeof difficultyColors]}
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
                <h3 className="font-medium">{problem.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {problem.concepts.map((concept) => (
                    <Badge key={concept} variant="secondary" className="text-xs">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-secondary/30 pt-3 pb-3">
                <Link href={`/problems/${problem.id}`} className="w-full">
                  <Button variant="default" className="w-full gap-2">
                    <Code className="h-4 w-4" />
                    Solve Problem
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No problems found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
