import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Problem } from "@/lib/supabase"
import { Lightbulb } from "lucide-react"

interface ProblemDetailProps {
  problem: Problem
}

export function ProblemDetail({ problem }: ProblemDetailProps) {
  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    Hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{problem.title}</CardTitle>
          <Badge variant="outline" className={difficultyColors[problem.difficulty as keyof typeof difficultyColors]}>
            {problem.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="description">
          <TabsList className="mb-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <div className="space-y-4">
              <p>{problem.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <h4 className="text-sm font-medium w-full">Concepts:</h4>
                {problem.concepts.map((concept) => (
                  <Badge key={concept} variant="secondary">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="hints">
            <div className="space-y-3">
              {problem.hints && problem.hints.length > 0 ? (
                problem.hints.map((hint, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-md bg-secondary/50">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <p className="text-sm">{hint}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No hints available for this problem.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="solution">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Sample Solution:</h4>
                <Button variant="ghost" size="sm">
                  Copy
                </Button>
              </div>
              <pre className="bg-secondary rounded-md p-4 overflow-x-auto text-sm">
                <code>{problem.solution}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
