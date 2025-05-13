"use client"

import { useState } from "react"
import type { Problem } from "@/lib/supabase"
import { CodeEditor } from "./code-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Save, Trophy } from "lucide-react"
import { useAuth } from "./auth-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProblemDetailProps {
  problem: Problem
}

function extractInputLabel(code: string): string | null {
  // Python input("label")
  let match = code.match(/input\("([^"]+)"\)/)
  if (match) return match[1]
  // C scanf("label")
  match = code.match(/scanf\("([^"]+)"/)
  if (match) return match[1]
  // Java new Scanner(System.in).next(); System.out.print("label")
  match = code.match(/System\.out\.print(?:ln)?\("([^"]+)"\)/)
  if (match) return match[1]
  return null
}

async function executeCodeWithCodex({
  code,
  language,
  input = "",
}: {
  code: string
  language: string
  input?: string
}) {
  // Remove input prompts for execution (for clean output)
  code = code
    .replace(/input\("([^"]+)"\)/g, "input()")
    .replace(/scanf\("([^"]+)"/g, 'scanf("')
    .replace(/System\.out\.print(?:ln)?\("([^"]+)"\)/g, "")

  const data = new URLSearchParams()
  data.append("language", language)
  data.append("code", code)
  if (input) data.append("input", input)

  try {
    const response = await fetch("https://api.codex.jaagrav.in", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    })
    const result = await response.json()
    return {
      success: !result.error,
      output: result.output || result.error,
      error: result.error,
    }
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? error.message : "Unknown error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export function ProblemDetail({ problem }: ProblemDetailProps) {
  const [code, setCode] = useState(problem.starter_code)
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean
    message: string
    output?: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [inputPrompt, setInputPrompt] = useState<string | null>(null)
  const [userInput, setUserInput] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  // You can infer language from problem, or add a selector
  const language = problem.language || "python"

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

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    // Detect input prompt label
    setInputPrompt(extractInputLabel(newCode))
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit solutions",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    setSubmissionResult(null)

    // Run code with Codex API
    const execResult = await executeCodeWithCodex({
      code,
      language,
      input: userInput,
    })

    if (!execResult.success) {
      setSubmissionResult({
        success: false,
        message: "Your code failed to execute correctly",
        output: execResult.output,
      })
      setIsSubmitting(false)
      return
    }

    // Simulate saving submission (replace with your DB logic)
    // await saveSubmissionToDB(user.id, problem.id, code)
    setSubmissionResult({
      success: true,
      message: "Solution submitted successfully!",
      output: execResult.output,
    })
    setShowSuccessDialog(true)
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-2xl">{problem.title}</CardTitle>
              <CardDescription>{problem.category || problem.concept}</CardDescription>
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
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <AlertTitle>{submissionResult.success ? "Success!" : "Submission Failed"}</AlertTitle>
          <AlertDescription>{submissionResult.message}</AlertDescription>
          {submissionResult.output && (
            <pre className="mt-2 bg-muted p-2 rounded text-xs">{submissionResult.output}</pre>
          )}
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Code Editor</h2>
        {user && (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-1">
            <Save className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
        )}
      </div>

      {/* Input Prompt Section (if code expects input) */}
      {inputPrompt && (
        <div className="mb-4">
          <label className="block font-medium mb-1">
            {inputPrompt}
            <input
              type="text"
              className="ml-2 border rounded px-2 py-1"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Enter input"
            />
          </label>
        </div>
      )}

      <CodeEditor
        problemId={problem.id}
        starterCode={problem.starter_code}
        testCases={problem.test_cases}
        value={code}
        onCodeChange={handleCodeChange}
        onExecute={async (code, input) => {
          const result = await executeCodeWithCodex({ code, language, input })
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
                <CardDescription>
                  Try to solve the problem on your own before looking at the solution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono">
                  {problem.solution}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="hints" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Hints</CardTitle>
                <CardDescription>
                  Use these hints if you're stuck on the problem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Think about the basic structure of a {language} program.</li>
                  <li>Remember to use proper syntax for the required operations.</li>
                  <li>Consider edge cases in your solution.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Problem Solved!
            </DialogTitle>
            <DialogDescription>
              Congratulations! You've successfully solved this problem.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Your solution has been saved and added to your profile.</p>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium">Problem: {problem.title}</p>
              <p className="text-sm text-muted-foreground">Difficulty: {problem.difficulty}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
