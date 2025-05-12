"use client"

import { useState } from "react"
import type { Problem } from "@/lib/supabase"
import { CodeEditor } from "./code-editor"
import { executeCode, useCodeSubmission } from "./code-executor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Save } from "lucide-react"
import { useAuth } from "./auth-provider"

interface ProblemDetailProps {
  problem: Problem
}

export function ProblemDetail({ problem }: ProblemDetailProps) {
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean
    message: string
    output?: string
  } | null>(null)

  const { submitSolution, isSubmitting } = useCodeSubmission()
  const { user } = useAuth()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500 hover:bg-green-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "hard":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const handleSubmit = async (code: string) => {
    const result = await submitSolution(problem.id, code)
    setSubmissionResult(result)
    return { success: result.success, output: result.output || "" }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-2xl">{problem.title}</CardTitle>
              <CardDescription>{problem.category}</CardDescription>
              
            </div>
            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>{problem.description}</p>
          </div>
        </CardContent>
      </Card>

      {submissionResult && (
        <Alert
          className={`mb-6 ${
            submissionResult.success
              ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
          }`}
        >
          {submissionResult.success ? (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <CheckCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <AlertTitle>{submissionResult.success ? "Success!" : "Submission Failed"}</AlertTitle>
          <AlertDescription>{submissionResult.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Code Editor</h2>
        {user && (
          <Button onClick={() => {}} disabled={isSubmitting} variant="outline" className="gap-1">
            <Save className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
        )}
      </div>

      <CodeEditor
        problemId={problem.id}
        starterCode={problem.starter_code}
        testCases={problem.test_cases}
        onExecute={async (code, input) => {
          const result = await executeCode({ code, input })
          return result
        }}
      />

      <div className="mt-6">
        <Tabs defaultValue="solution">
          <TabsList>
            <TabsTrigger value="solution">Solution</TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
          </TabsList>
          <TabsContent value="solution" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sample Solution</CardTitle>
                <CardDescription>Try to solve the problem on your own before looking at the solution.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono">{problem.solution}</pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="hints" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Hints</CardTitle>
                <CardDescription>Use these hints if you're stuck on the problem.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Think about the basic structure of a Java program.</li>
                  <li>Remember to use proper syntax for the required operations.</li>
                  <li>Consider edge cases in your solution.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
